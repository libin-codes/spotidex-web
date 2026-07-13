import asyncio
import io
import re
import zipfile
from pathlib import Path

from fastapi import HTTPException

from app.services.downloader import download_track, MAX_CONCURRENT, MAX_RETRIES
from app.services.job_store import JobStore
from app.services.cleanup import CleanupManager
from app.models import (
    DownloadJob,
    DownloadJobType,
    DownloadStatus,
    TrackDownloadStatus,
    TrackModel,
)


class DownloadManager:
    _instance: "DownloadManager | None" = None
    _job_store: JobStore
    _cleanup: CleanupManager

    def __new__(cls) -> "DownloadManager":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._job_store = JobStore()
            cls._instance._cleanup = CleanupManager()
        return cls._instance

    def create_job(self, name: str, type: DownloadJobType, tracks: list[TrackModel]) -> str:
        job_id = self._job_store.create(name, type, tracks)
        job_dir = self._cleanup.create_dir()
        self._cleanup.register(job_id, job_dir)
        return job_id

    def get_job(self, job_id: str) -> DownloadJob | None:
        return self._job_store.get(job_id)

    def get_job_dir(self, job_id: str) -> str | None:
        return self._cleanup.get_dir(job_id)

    def get_queue(self, job_id: str) -> asyncio.Queue[dict[str, object] | None] | None:
        return self._job_store.get_queue(job_id)

    def start_download(self, job_id: str, tracks: list[TrackModel]) -> asyncio.Task[None]:
        return asyncio.create_task(self._run_download(job_id, tracks))

    def cancel_cleanup_timer(self, job_id: str) -> None:
        self._cleanup.cancel_cleanup(job_id)

    def remove_job_dir(self, job_id: str) -> None:
        self._cleanup.remove_dir(job_id)

    def prepare_file_serve(self, job_id: str) -> tuple[DownloadJob, list[Path]]:
        job = self._job_store.get(job_id)
        if job is None:
            raise HTTPException(status_code=404, detail="Job not found")

        if job.status != DownloadStatus.COMPLETED:
            raise HTTPException(status_code=409, detail="Download not completed")

        job_dir = self._cleanup.get_dir(job_id)
        if job_dir is None:
            raise HTTPException(status_code=410, detail="Download expired")

        self._cleanup.cancel_cleanup(job_id)

        mp3_files = list(Path(job_dir).glob("*.mp3"))
        if not mp3_files:
            raise HTTPException(status_code=410, detail="Download expired")

        return job, mp3_files

    def build_zip(self, job_id: str) -> tuple[io.BytesIO, str]:
        job_dir = self._cleanup.get_dir(job_id)
        assert job_dir is not None

        job = self._job_store.get(job_id)
        assert job is not None

        safe_name = re.sub(r'[^\w\- ]', '', job.name).strip() or job.name
        zip_name = f"{safe_name}.zip"

        mp3_files = list(Path(job_dir).glob("*.mp3"))
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in mp3_files:
                zf.write(f, f.name)
        buf.seek(0)

        return buf, zip_name

    async def _run_download(self, job_id: str, tracks: list[TrackModel]) -> None:
        job_dir = self._cleanup.get_dir(job_id)
        assert job_dir is not None

        self._job_store.set_status(job_id, DownloadStatus.DOWNLOADING)

        semaphore = asyncio.Semaphore(MAX_CONCURRENT)

        async def download_one(i: int, track: TrackModel) -> None:
            async with semaphore:
                for attempt in range(MAX_RETRIES):
                    self._job_store.update_progress(
                        job_id, i, TrackDownloadStatus.DOWNLOADING, 0.0
                    )

                    def on_progress(pct: float) -> None:
                        self._job_store.update_progress(
                            job_id, i, TrackDownloadStatus.DOWNLOADING, pct
                        )

                    try:
                        await asyncio.to_thread(
                            download_track, track, job_dir, on_progress
                        )
                        self._job_store.update_progress(
                            job_id, i, TrackDownloadStatus.COMPLETED, 100.0
                        )
                        self._job_store.increment_completed(job_id)
                        return
                    except Exception as e:
                        self._job_store.update_progress(
                            job_id, i, TrackDownloadStatus.DOWNLOADING, 0.0, str(e)
                        )

                self._job_store.update_progress(
                    job_id, i, TrackDownloadStatus.FAILED, 0.0
                )
                self._job_store.increment_failed(job_id)

        await asyncio.gather(*[download_one(i, t) for i, t in enumerate(tracks)])

        job = self._job_store.get(job_id)
        assert job is not None

        if job.completed == job.total:
            self._job_store.set_status(job_id, DownloadStatus.COMPLETED)
        elif job.failed == job.total:
            self._job_store.set_status(job_id, DownloadStatus.FAILED)
        else:
            self._job_store.set_status(job_id, DownloadStatus.COMPLETED)

        self._job_store.close_queue(job_id)
        self._cleanup.schedule_cleanup(job_id)
