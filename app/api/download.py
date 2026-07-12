from fastapi import APIRouter

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
