import asyncio
from datetime import datetime, timezone
from uuid import uuid4

from app.models import (
    DownloadJob,
    DownloadJobType,
    DownloadStatus,
    TrackDownloadProgress,
    TrackDownloadStatus,
    TrackModel,
)


class JobStore:
    _jobs: dict[str, DownloadJob]
    _queues: dict[str, asyncio.Queue[dict[str, object] | None]]

    def __init__(self) -> None:
        self._jobs = {}
        self._queues = {}

    def create(self, name: str, type: DownloadJobType, tracks: list[TrackModel]) -> str:
        job_id = str(uuid4())

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

    def get(self, job_id: str) -> DownloadJob | None:
        return self._jobs.get(job_id)

    def get_queue(self, job_id: str) -> asyncio.Queue[dict[str, object] | None] | None:
        return self._queues.get(job_id)

    def update_progress(
        self,
        job_id: str,
        index: int,
        status: TrackDownloadStatus,
        percent: float,
        error: str | None = None,
    ) -> None:
        job = self._jobs[job_id]
        progress = job.tracks[index]
        progress.status = status
        progress.percent = percent
        progress.error = error
        self._notify(job_id)

    def set_status(self, job_id: str, status: DownloadStatus) -> None:
        self._jobs[job_id].status = status
        self._notify(job_id)

    def increment_completed(self, job_id: str) -> None:
        self._jobs[job_id].completed += 1

    def increment_failed(self, job_id: str) -> None:
        self._jobs[job_id].failed += 1

    def close_queue(self, job_id: str) -> None:
        queue = self._queues.get(job_id)
        if queue is not None:
            queue.put_nowait(None)

    def _notify(self, job_id: str) -> None:
        queue = self._queues.get(job_id)
        if queue is not None:
            queue.put_nowait(self._jobs[job_id].model_dump())
