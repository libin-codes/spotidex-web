# models.py
from pydantic import BaseModel
from typing import List


class TrackModel(BaseModel):
    spotify_id: str
    name: str
    cover_url: str
    artists: List[str]
    album_name: str
    year: str
    youtube_id: str = ""


class PlaylistModel(BaseModel):
    spotify_id: str
    name: str
    cover_url: str
    creator: str
    length: int
    tracks: List[TrackModel]


class AlbumModel(BaseModel):
    spotify_id: str
    name: str
    cover_url: str
    artists: List[str]
    length: int
    tracks: List[TrackModel]


