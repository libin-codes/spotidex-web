# models.py
from pydantic import BaseModel
from typing import List
from enum import Enum


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


class TrackDownloadStatus(str, Enum):
    PENDING = "pending"
    DOWNLOADING = "downloading"
    COMPLETED = "completed"
    FAILED = "failed"


class TrackDownloadProgress(BaseModel):
    spotify_id: str
    name: str
    artists: List[str]
    status: TrackDownloadStatus = TrackDownloadStatus.PENDING
    error: str | None = None


class DownloadJobType(str, Enum):
    TRACK = "track"
    PLAYLIST = "playlist"
    ALBUM = "album"


class DownloadStatus(str, Enum):
    PENDING = "pending"
    DOWNLOADING = "downloading"
    COMPLETED = "completed"
    FAILED = "failed"


class DownloadJob(BaseModel):
    job_id: str
    type: DownloadJobType
    status: DownloadStatus = DownloadStatus.PENDING
    total: int
    completed: int = 0
    failed: int = 0
    tracks: List[TrackDownloadProgress]
    created_at: str


class DownloadResponse(BaseModel):
    job_id: str


