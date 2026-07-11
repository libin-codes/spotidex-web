import asyncio
from spotipy import Spotify, SpotifyClientCredentials
from ytmusicapi import YTMusic
from app.models import TrackModel, PlaylistModel, AlbumModel


class SpotidexClient:
    """
    Spotify client for Fetching and downloading tracks/playlist and albums.

    Supports:
    - Fetching track/album/playlist data
    - Resolving YouTube Music IDs for each track
    - Downloading Songs with progress tracking
    """

    def __init__(self, client_id: str, client_secret: str):
        auth_manager = SpotifyClientCredentials(client_id, client_secret)
        self.spotify = Spotify(auth_manager=auth_manager)
        self.ytmusic = YTMusic()
        self._yt_semaphore = asyncio.Semaphore(5)

    def _build_track(self, track) -> TrackModel:
        return TrackModel(
            spotify_id=track["id"],
            name=track["name"],
            cover_url=track["album"]["images"][0]["url"],
            artists=[artist["name"] for artist in track["artists"]],
            album_name=track["album"]["name"],
            year=track["album"]["release_date"][:4],
        )

    async def _resolve_youtube_id(self, track_name: str, artists: list[str]) -> str:
        query = f"{track_name} {artists[0]}"
        results = await asyncio.to_thread(
            self.ytmusic.search, query, filter="songs", limit=1
        )
        if results and "videoId" in results[0]:
            return results[0]["videoId"]
        return ""

    async def _resolve_tracks_youtube_ids(self, tracks: list[TrackModel]) -> list[TrackModel]:
        async def resolve_one(track: TrackModel) -> TrackModel:
            async with self._yt_semaphore:
                youtube_id = await self._resolve_youtube_id(track.name, track.artists)
                return track.model_copy(update={"youtube_id": youtube_id})
                
        
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(resolve_one(t)) for t in tracks]

        return [t.result() for t in tasks]

    async def get_track(self, track_id: str) -> TrackModel:
        track = self.spotify.track(track_id)
        if not track:
            raise ValueError(f"Track not found: {track_id}")
        built = self._build_track(track)
        built.youtube_id = await self._resolve_youtube_id(built.name, built.artists)
        return built

    async def get_playlist(self, playlist_id: str) -> PlaylistModel:
        playlist = self.spotify.playlist(playlist_id)
        if not playlist:
            raise ValueError(f"Playlist not found: {playlist_id}")
        model = PlaylistModel(
            spotify_id=playlist["id"],
            name=playlist["name"],
            cover_url=playlist["images"][0]["url"],
            length=playlist["items"]["total"],
            tracks=[self._build_track(item["track"]) for item in playlist["items"]["items"]],
            creator=playlist["owner"]["display_name"],
        )
        model.tracks = await self._resolve_tracks_youtube_ids(model.tracks)
        return model

    async def get_album(self, album_id: str) -> AlbumModel:
        album = self.spotify.album(album_id)
        if not album:
            raise ValueError(f"Album not found: {album_id}")
        model = AlbumModel(
            spotify_id=album["id"],
            name=album["name"],
            cover_url=album["images"][0]["url"],
            length=album["tracks"]["total"],
            tracks=[self._build_track(item) for item in album["tracks"]["items"]],
            artists=[artist["name"] for artist in album["artists"]],
        )
        model.tracks = await self._resolve_tracks_youtube_ids(model.tracks)
        return model
