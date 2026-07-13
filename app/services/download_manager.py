import asyncio
import os
import shutil
import tempfile
import time
from collections.abc import Callable
from pathlib import Path
from typing import cast
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

from typing import Mapping, Any

MAX_CONCURRENT = 5
MAX_RETRIES = 3
CLEANUP_DELAY = 300  # 5 minutes


class DownloadManager:
    _instance: "DownloadManager | None" = None
    _jobs: dict[str, DownloadJob]
    _queues: dict[str, asyncio.Queue[dict[str, object] | None]]
    _job_dirs: dict[str, str]
    _cleanup_timers: dict[str, asyncio.Task[None]]

    def __new__(cls) -> "DownloadManager":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._jobs = {}
            cls._instance._queues = {}
            cls._instance._job_dirs = {}
            cls._instance._cleanup_timers = {}
            cls._instance._cleanup_orphans()
        return cls._instance

    def _cleanup_orphans(self) -> None:
        tmp = Path(tempfile.gettempdir())
        now = time.time()
        for d in tmp.glob("spotidex_*"):
            if d.is_dir() and (now - d.stat().st_mtime) > CLEANUP_DELAY:
                shutil.rmtree(d, ignore_errors=True)

    def create_job(self, name: str, type: DownloadJobType, tracks: list[TrackModel]) -> str:
        job_id = str(uuid4())
        job_dir = tempfile.mkdtemp(prefix="spotidex_")
        self._job_dirs[job_id] = job_dir

        job = DownloadJob(
            job_id=job_id,
            name=name,
            type=type,
            total=len(tracks),
            tracks=[
                TrackDownloadProgress(
                    spotify_id=t.spotify_id,
                    name=t.name,
                    artists=t.artists,
                    duration_seconds=t.duration_seconds,
                )
                for t in tracks
            ],
            created_at=datetime.now(timezone.utc).isoformat(),
        )
        self._jobs[job_id] = job
        self._queues[job_id] = asyncio.Queue()
        return job_id

    def get_job(self, job_id: str) -> DownloadJob | None:
        return self._jobs.get(job_id)

    def get_job_dir(self, job_id: str) -> str | None:
        return self._job_dirs.get(job_id)

    def get_queue(self, job_id: str) -> asyncio.Queue[dict[str, object] | None] | None:
        return self._queues.get(job_id)

    def start_download(
        self, job_id: str, tracks: list[TrackModel]
    ) -> asyncio.Task[None]:
        return asyncio.create_task(self._run_download(job_id, tracks))

    def cancel_cleanup_timer(self, job_id: str) -> None:
        timer = self._cleanup_timers.pop(job_id, None)
        if timer is not None:
            timer.cancel()

    def _remove_job_dir(self, job_id: str) -> None:
        job_dir = self._job_dirs.pop(job_id, None)
        if job_dir:
            shutil.rmtree(job_dir, ignore_errors=True)

    async def _schedule_cleanup(self, job_id: str) -> None:
        await asyncio.sleep(CLEANUP_DELAY)
        self._remove_job_dir(job_id)
        self._cleanup_timers.pop(job_id, None)

    def _notify(self, job_id: str) -> None:
        queue = self._queues.get(job_id)
        if queue is not None:
            queue.put_nowait(self._jobs[job_id].model_dump())

    async def _run_download(self, job_id: str, tracks: list[TrackModel]) -> None:
        job = self._jobs[job_id]
        job.status = DownloadStatus.DOWNLOADING
        job_dir = self._job_dirs[job_id]
        self._notify(job_id)

        semaphore = asyncio.Semaphore(MAX_CONCURRENT)

        async def download_one(i: int, track: TrackModel) -> None:
            async with semaphore:
                progress = job.tracks[i]

                def on_progress(pct: float) -> None:
                    progress.percent = pct
                    self._notify(job_id)

                for attempt in range(MAX_RETRIES):
                    progress.status = TrackDownloadStatus.DOWNLOADING
                    progress.percent = 0.0
                    progress.error = None
                    self._notify(job_id)

                    try:
                        await asyncio.to_thread(
                            self._download_track, track, job_dir, on_progress
                        )
                        progress.status = TrackDownloadStatus.COMPLETED
                        progress.percent = 100.0
                        job.completed += 1
                        self._notify(job_id)
                        return
                    except Exception as e:
                        progress.error = str(e)

                progress.status = TrackDownloadStatus.FAILED
                job.failed += 1
                self._notify(job_id)

        await asyncio.gather(*[download_one(i, t) for i, t in enumerate(tracks)])

        if job.completed == job.total:
            job.status = DownloadStatus.COMPLETED
        elif job.failed == job.total:
            job.status = DownloadStatus.FAILED
        else:
            job.status = DownloadStatus.COMPLETED

        self._notify(job_id)
        queue = self._queues.get(job_id)
        if queue is not None:
            queue.put_nowait(None)

        self._cleanup_timers[job_id] = asyncio.create_task(self._schedule_cleanup(job_id))

    def _download_track(
        self, track: TrackModel, job_dir: str, on_progress: Callable[[float], None]
    ) -> None:
        url = f"https://www.youtube.com/watch?v={track.youtube_id}"
        filepath = os.path.join(job_dir, f"{track.name} - {track.artists[0]}")

        def progress_hook(d: Mapping[str, Any]) -> None:
            if d.get("status") == "downloading":
                downloaded = float(cast("int | float", d.get("downloaded_bytes", 0)))
                total_raw = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
                total = float(cast("int | float", total_raw))
                if total > 0:
                    on_progress(downloaded / total * 97)
            elif d.get("status") == "finished":
                on_progress(97.0)

        ydl_opts = {

            "format": "bestaudio/best",
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "320",
                },   
            ],
            "outtmpl": filepath,
            "quiet": True,
            "no_warnings": True,
            "progress_hooks": [progress_hook],
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:   # pyright: ignore[reportArgumentType]
            ydl.download([url])


        mp3_path = filepath + ".mp3"


        self._embed_metadata(mp3_path, track)


    def _embed_metadata(self, mp3_path: str, track: TrackModel) -> None:
        audio = MP3(mp3_path, ID3=ID3)

        if audio.tags is None:
            audio.add_tags()

        tags = audio.tags
        assert tags is not None

        tags.add(TIT2(encoding=3, text=[track.name]))
        tags.add(TPE1(encoding=3, text=[", ".join(track.artists)]))
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
