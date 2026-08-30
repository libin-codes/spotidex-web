import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, StreamingResponse
from starlette.background import BackgroundTask
from ytmusicapi import YTMusic

from app.services.download_manager import DownloadManager
from app.models import (
    AlbumModel,
    DownloadJobType,
    DownloadResponse,
    PlaylistModel,
    TrackModel,
)

router = APIRouter(prefix="/download", tags=["download"])
manager = DownloadManager()
ytmusic = YTMusic()


async def resolve_youtube_data(track: TrackModel) -> TrackModel:
    query = f"{track.name} {track.artists[0]}" if track.artists else track.name
    results = await asyncio.to_thread(ytmusic.search, query, filter="songs", limit=1)
    if results and "videoId" in results[0]:
        return track.model_copy(
            update={
                "youtube_id": results[0]["videoId"],
                "duration_seconds": int(results[0].get("duration_seconds", track.duration_seconds)),
            }
        )
    return track


async def resolve_download_tracks(tracks: list[TrackModel]) -> list[TrackModel]:
    resolved = await asyncio.gather(*(resolve_youtube_data(track) for track in tracks))
    return list(resolved)


@router.post("/track", response_model=DownloadResponse)
async def download_track(track: TrackModel) -> DownloadResponse:
    prepared = await resolve_download_tracks([track])
    job_id = manager.create_job(prepared[0].name, DownloadJobType.TRACK, prepared)
    manager.start_download(job_id, prepared)
    return DownloadResponse(job_id=job_id)


@router.post("/playlist", response_model=DownloadResponse)
async def download_playlist(playlist: PlaylistModel) -> DownloadResponse:
    prepared = await resolve_download_tracks(playlist.tracks)
    job_id = manager.create_job(playlist.name, DownloadJobType.PLAYLIST, prepared)
    manager.start_download(job_id, prepared)
    return DownloadResponse(job_id=job_id)


@router.post("/album", response_model=DownloadResponse)
async def download_album(album: AlbumModel) -> DownloadResponse:
    prepared = await resolve_download_tracks(album.tracks)
    job_id = manager.create_job(album.name, DownloadJobType.ALBUM, prepared)
    manager.start_download(job_id, prepared)
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
            await websocket.send_json(update)
        await websocket.close()
    except WebSocketDisconnect:
        pass


@router.get("/{job_id}/file", response_model=None)
async def download_file(job_id: str) -> FileResponse | StreamingResponse:
    job, mp3_files = manager.prepare_file_serve(job_id)

    if job.type == DownloadJobType.TRACK:
        return FileResponse(
            path=str(mp3_files[0]),
            media_type="audio/mpeg",
            filename=mp3_files[0].name,
            background=BackgroundTask(manager.remove_job_dir, job_id),
        )

    buf, zip_name = manager.build_zip(job_id)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{zip_name}"'},
        background=BackgroundTask(manager.remove_job_dir, job_id),
    )
