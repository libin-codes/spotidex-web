import asyncio
import shutil
import tempfile
import time
from pathlib import Path

CLEANUP_DELAY = 300  # 5 minutes


class CleanupManager:
    _job_dirs: dict[str, str]
    _cleanup_timers: dict[str, asyncio.Task[None]]

    def __init__(self) -> None:
        self._job_dirs = {}
        self._cleanup_timers = {}
        self._cleanup_orphans()

    def create_dir(self) -> str:
        return tempfile.mkdtemp(prefix="spotidex_")

    def register(self, job_id: str, dir_path: str) -> None:
        self._job_dirs[job_id] = dir_path

    def get_dir(self, job_id: str) -> str | None:
        return self._job_dirs.get(job_id)

    def remove_dir(self, job_id: str) -> None:
        job_dir = self._job_dirs.pop(job_id, None)
        if job_dir:
            shutil.rmtree(job_dir, ignore_errors=True)

    def schedule_cleanup(self, job_id: str) -> None:
        self._cleanup_timers[job_id] = asyncio.create_task(
            self._run_cleanup(job_id)
        )

    def cancel_cleanup(self, job_id: str) -> None:
        timer = self._cleanup_timers.pop(job_id, None)
        if timer is not None:
            timer.cancel()

    async def _run_cleanup(self, job_id: str) -> None:
        await asyncio.sleep(CLEANUP_DELAY)
        self.remove_dir(job_id)
        self._cleanup_timers.pop(job_id, None)

    def _cleanup_orphans(self) -> None:
        tmp = Path(tempfile.gettempdir())
        now = time.time()
        for d in tmp.glob("spotidex_*"):
            if d.is_dir() and (now - d.stat().st_mtime) > CLEANUP_DELAY:
                shutil.rmtree(d, ignore_errors=True)
