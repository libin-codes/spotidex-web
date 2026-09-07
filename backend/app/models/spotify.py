from pydantic import BaseModel
from typing import List


class TrackModel(BaseModel):
    spotify_id: str
    name: str
    cover_url: str
    artists: List[str]
    album_name: str
    year: str
    duration_seconds: int


class PlaylistModel(BaseModel):
    spotify_id: str
    name: str
    cover_url: str
    creator: str
    length: int
    tracks: List[TrackModel]
    duration_seconds: int


class AlbumModel(BaseModel):
    spotify_id: str
    name: str
    cover_url: str
    artists: List[str]
    length: int
    tracks: List[TrackModel]
    duration_seconds: int


class PlaylistSearchResult(BaseModel):
    spotify_id: str
    name: str
    cover_url: str
    creator: str
    total_tracks: int = 0


class AlbumSearchResult(BaseModel):
    spotify_id: str
    name: str
    cover_url: str
    artists: List[str]
    total_tracks: int = 0


class SearchResults(BaseModel):
    tracks: List[TrackModel]
    playlists: List[PlaylistSearchResult]
    albums: List[AlbumSearchResult]
