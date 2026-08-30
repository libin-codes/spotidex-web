import asyncio
from spotipy import Spotify, SpotifyClientCredentials
from app.models import TrackModel, PlaylistModel, AlbumModel


class SpotifyService:
    """
    Service for fetching Spotify metadata.

    Spotify responses are converted into the application model while keeping the
    expensive YouTube lookup out of the read path.
    """

    def __init__(self, client_id: str, client_secret: str):
        auth_manager = SpotifyClientCredentials(client_id, client_secret)
        self.spotify = Spotify(auth_manager=auth_manager)

    def _build_track(self, track) -> TrackModel:
        duration_ms = int(track.get("duration_ms", 0))
        return TrackModel(
            spotify_id=track["id"],
            name=track["name"],
            cover_url=track["album"]["images"][0]["url"],
            artists=[artist["name"] for artist in track["artists"]],
            album_name=track["album"]["name"],
            year=track["album"]["release_date"][:4],
            duration_seconds=max(0, duration_ms // 1000),
        )

    def _build_album_track(self, track, album) -> TrackModel:
        duration_ms = int(track.get("duration_ms", 0))
        return TrackModel(
            spotify_id=track["id"],
            name=track["name"],
            cover_url=album["images"][0]["url"],
            artists=[artist["name"] for artist in track["artists"]],
            album_name=album["name"],
            year=album["release_date"][:4],
            duration_seconds=max(0, duration_ms // 1000),
        )

    async def get_track(self, track_id: str) -> TrackModel:
        track = self.spotify.track(track_id)
        if not track:
            raise ValueError(f"Track not found: {track_id}")
        return self._build_track(track)

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
        model.duration_seconds = sum(t.duration_seconds for t in model.tracks)
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
            artists=[artist["name"] for artist in album["artists"]],
            tracks=[self._build_album_track(item, album) for item in album["tracks"]["items"]],
        )
        model.duration_seconds = sum(t.duration_seconds for t in model.tracks)
        return model
