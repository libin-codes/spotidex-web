import os

from fastapi import APIRouter

from app.models import TrackModel, PlaylistModel, AlbumModel
from app.services.SpotidexClient import SpotidexClient

router = APIRouter(tags=["spotify"])

client_id = os.getenv("CLIENT_ID", "")
client_secret = os.getenv("CLIENT_SECRET", "")
spotidex = SpotidexClient(client_id, client_secret)


@router.get("/track/{track_id}", response_model=TrackModel)
async def get_track(track_id: str) -> TrackModel:
    return await spotidex.get_track(track_id)


@router.get("/playlist/{playlist_id}", response_model=PlaylistModel)
async def get_playlist(playlist_id: str) -> PlaylistModel:
    return await spotidex.get_playlist(playlist_id)


@router.get("/album/{album_id}", response_model=AlbumModel)
async def get_album(album_id: str) -> AlbumModel:
    return await spotidex.get_album(album_id)
