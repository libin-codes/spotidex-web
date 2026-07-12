import io
import os
import zipfile
from pathlib import Path

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, StreamingResponse

from app.services.download_manager import DOWNLOADS_DIR, DownloadManager
from app.models import (
    AlbumModel,
    DownloadJobType,
    DownloadResponse,
    DownloadStatus,
    PlaylistModel,
    TrackModel,
)

router = APIRouter(prefix="/download", tags=["download"])
manager = DownloadManager()


@router.post("/track", response_model=DownloadResponse)
async def download_track(track: TrackModel) -> DownloadResponse:
    job_id = manager.create_job(DownloadJobType.TRACK, [track])
    manager.start_download(job_id, [track])
    return DownloadResponse(job_id=job_id)


@router.post("/playlist", response_model=DownloadResponse)
async def download_playlist(playlist: PlaylistModel) -> DownloadResponse:
    job_id = manager.create_job(DownloadJobType.PLAYLIST, playlist.tracks)
    manager.start_download(job_id, playlist.tracks)
    return DownloadResponse(job_id=job_id)


@router.post("/album", response_model=DownloadResponse)
async def download_album(album: AlbumModel) -> DownloadResponse:
    job_id = manager.create_job(DownloadJobType.ALBUM, album.tracks)
    manager.start_download(job_id, album.tracks)
    return DownloadResponse(job_id=job_id)


@router.websocket("/{job_id}/status")
async def download_status(websocket: WebSocket, job_id: str) -> None:
    job = manager.get_job(job_id)
    if job is None:
        await websocket.close(code=4004, reason="Job not found")
        return

    await websocket.accept()

    queue = manager.get_queue(job_id)
    if queue is None:
        await websocket.close(code=4004, reason="Job queue not found")
        return

    try:
        while True:
            update = await queue.get()
            if update is None:
                break
            await websocket.send_json(update.model_dump())
        await websocket.close()
    except WebSocketDisconnect:
        pass


@router.get("/{job_id}/file",response_model=None)
async def download_file(job_id: str) -> FileResponse | StreamingResponse:
    job = manager.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status != DownloadStatus.COMPLETED:
        raise HTTPException(status_code=409, detail="Download not completed")

    job_dir = Path(DOWNLOADS_DIR) / job_id
    mp3_files = list(job_dir.glob("*.mp3"))

    if not mp3_files:
        raise HTTPException(status_code=500, detail="No files found on disk")

    if job.type == DownloadJobType.TRACK:
        return FileResponse(
            path=str(mp3_files[0]),
            media_type="audio/mpeg",
            filename=mp3_files[0].name,
        )

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in mp3_files:
            zf.write(f, f.name)
    buf.seek(0)

    zip_name = f"{job.type.value}_{job_id[:8]}.zip"
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{zip_name}"'},
    )
