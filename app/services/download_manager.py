import asyncio
import os
from datetime import datetime, timezone
from uuid import uuid4

import requests
import yt_dlp
from mutagen.id3 import ID3, APIC, TIT2, TPE1, TALB, TDRC
from mutagen.mp3 import MP3

from app.models import (
    DownloadJob,
    DownloadJobType,
    DownloadStatus,
    TrackDownloadProgress,
    TrackDownloadStatus,
    TrackModel,
)

DOWNLOADS_DIR = "downloads"


class DownloadManager:
    _instance: "DownloadManager | None" = None
    _jobs: dict[str, DownloadJob]

    def __new__(cls) -> "DownloadManager":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._jobs = {}
        return cls._instance

    def create_job(self, type: DownloadJobType, tracks: list[TrackModel]) -> str:
        job_id = str(uuid4())
        job_dir = os.path.join(DOWNLOADS_DIR, job_id)
        os.makedirs(job_dir, exist_ok=True)

        job = DownloadJob(
            job_id=job_id,
            type=type,
            total=len(tracks),
            tracks=[
                TrackDownloadProgress(
                    spotify_id=t.spotify_id,
                    name=t.name,
                    artists=t.artists,
                )
                for t in tracks
            ],
            created_at=datetime.now(timezone.utc).isoformat(),
        )
        self._jobs[job_id] = job
        return job_id

    def get_job(self, job_id: str) -> DownloadJob | None:
        return self._jobs.get(job_id)

    def start_download(
        self, job_id: str, tracks: list[TrackModel]
    ) -> asyncio.Task[None]:
        return asyncio.create_task(self._run_download(job_id, tracks))

    async def _run_download(self, job_id: str, tracks: list[TrackModel]) -> None:
        job = self._jobs[job_id]
        job.status = DownloadStatus.DOWNLOADING
        job_dir = os.path.join(DOWNLOADS_DIR, job_id)

        for i, track in enumerate(tracks):
            progress = job.tracks[i]
            progress.status = TrackDownloadStatus.DOWNLOADING

            try:
                await asyncio.to_thread(self._download_track, track, job_dir)
                progress.status = TrackDownloadStatus.COMPLETED
                job.completed += 1
            except Exception as e:
                progress.status = TrackDownloadStatus.FAILED
                progress.error = str(e)
                job.failed += 1

        if job.completed == job.total:
            job.status = DownloadStatus.COMPLETED
        elif job.failed == job.total:
            job.status = DownloadStatus.FAILED
        else:
            job.status = DownloadStatus.COMPLETED

    def _download_track(self, track: TrackModel, job_dir: str) -> None:
        url = f"https://www.youtube.com/watch?v={track.youtube_id}"
        outtmpl = os.path.join(job_dir, "%(title)s.%(ext)s")

        ydl_opts: dict = {
            "format": "bestaudio/best",
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "320",
                },
            ],
            "outtmpl": outtmpl,
            "quiet": True,
            "no_warnings": True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:  # type: ignore[reportArgumentType]
            ydl.download([url])

        mp3_path = self._find_downloaded_file(job_dir)
        if mp3_path is None:
            raise RuntimeError("Download completed but MP3 file not found")

        self._embed_metadata(mp3_path, track)

    def _find_downloaded_file(self, job_dir: str) -> str | None:
        for f in os.listdir(job_dir):
            if f.endswith(".mp3"):
                return os.path.join(job_dir, f)
        return None

    def _embed_metadata(self, mp3_path: str, track: TrackModel) -> None:
        audio = MP3(mp3_path, ID3=ID3)

        if audio.tags is None:
            audio.add_tags()

        tags = audio.tags
        assert tags is not None

        tags.add(TIT2(encoding=3, text=[track.name]))
        tags.add(TPE1(encoding=3, text=[" & ".join(track.artists)]))
        tags.add(TALB(encoding=3, text=[track.album_name]))
        tags.add(TDRC(encoding=3, text=[track.year]))

        if track.cover_url:
            cover_data = requests.get(track.cover_url, timeout=10).content
            tags.add(
                APIC(
                    encoding=3,
                    mime="image/jpeg",
                    type=3,
                    desc="Cover",
                    data=cover_data,
                )
            )

        audio.save()
