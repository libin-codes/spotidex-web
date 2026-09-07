import asyncio
from spotipy import Spotify, SpotifyClientCredentials
from app.models import TrackModel, PlaylistModel, AlbumModel, PlaylistSearchResult, AlbumSearchResult, SearchResults


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
        duration_ms = int(track.get("duration_ms") or 0)
        album = track.get("album") or {}
        images = album.get("images") or []
        cover_url = images[0].get("url", "") if images and isinstance(images[0], dict) else ""
        artists = [
            artist.get("name", "")
            for artist in (track.get("artists") or [])
            if artist and isinstance(artist, dict)
        ]
        release_date = album.get("release_date") or ""
        year = release_date[:4] if release_date else ""
        return TrackModel(
            spotify_id=track.get("id", ""),
            name=track.get("name", ""),
            cover_url=cover_url,
            artists=artists,
            album_name=album.get("name", ""),
            year=year,
            duration_seconds=max(0, duration_ms // 1000),
        )

    def _build_album_track(self, track, album) -> TrackModel:
        duration_ms = int(track.get("duration_ms") or 0)
        images = (album or {}).get("images") or []
        cover_url = images[0].get("url", "") if images and isinstance(images[0], dict) else ""
        artists = [
            artist.get("name", "")
            for artist in (track.get("artists") or [])
            if artist and isinstance(artist, dict)
        ]
        release_date = (album or {}).get("release_date") or ""
        year = release_date[:4] if release_date else ""
        return TrackModel(
            spotify_id=track.get("id", ""),
            name=track.get("name", ""),
            cover_url=cover_url,
            artists=artists,
            album_name=(album or {}).get("name", ""),
            year=year,
            duration_seconds=max(0, duration_ms // 1000),
        )

    async def get_track(self, track_id: str) -> TrackModel:
        track = self.spotify.track(track_id)
        if not track:
            raise ValueError(f"Track not found: {track_id}")
        return self._build_track(track)

    async def search_tracks(self, query: str, limit: int = 8) -> list[TrackModel]:
        cleaned_query = query.strip()
        if not cleaned_query:
            return []

        results = self.spotify.search(
            q=cleaned_query,
            type="track",
            limit=limit,
        )

        tracks = (results.get("tracks") or {}).get("items") or []
        return [self._build_track(track) for track in tracks if track is not None]

    def _build_playlist_search_result(self, playlist) -> PlaylistSearchResult:
        images = playlist.get("images") or []
        cover_url = images[0].get("url", "") if images and isinstance(images[0], dict) else ""
        owner = playlist.get("owner") or {}
        creator = owner.get("display_name") or owner.get("id") or ""
        total_tracks = int((playlist.get("tracks") or {}).get("total") or 0)
        return PlaylistSearchResult(
            spotify_id=playlist.get("id", ""),
            name=playlist.get("name", ""),
            cover_url=cover_url,
            creator=creator,
            total_tracks=total_tracks,
        )

    def _build_album_search_result(self, album) -> AlbumSearchResult:
        images = album.get("images") or []
        cover_url = images[0].get("url", "") if images and isinstance(images[0], dict) else ""
        artists = [
            artist.get("name", "")
            for artist in (album.get("artists") or [])
            if artist and isinstance(artist, dict)
        ]
        total_tracks = int(album.get("total_tracks") or (album.get("tracks") or {}).get("total") or 0)
        return AlbumSearchResult(
            spotify_id=album.get("id", ""),
            name=album.get("name", ""),
            cover_url=cover_url,
            artists=artists,
            total_tracks=total_tracks,
        )

    async def search(self, query: str, limit: int = 8) -> SearchResults:
        cleaned_query = query.strip()
        if not cleaned_query:
            return SearchResults(tracks=[], playlists=[], albums=[])

        results = self.spotify.search(
            q=cleaned_query,
            type="track,playlist,album",
            limit=limit,
        ) or {}

        tracks = [
            self._build_track(t)
            for t in (results.get("tracks") or {}).get("items") or []
            if t is not None
        ]
        playlists = [
            self._build_playlist_search_result(p)
            for p in (results.get("playlists") or {}).get("items") or []
            if p is not None
        ]
        albums = [
            self._build_album_search_result(a)
            for a in (results.get("albums") or {}).get("items") or []
            if a is not None
        ]

        return SearchResults(tracks=tracks, playlists=playlists, albums=albums)

    async def get_playlist(self, playlist_id: str) -> PlaylistModel:
        playlist = self.spotify.playlist(playlist_id)
        if not playlist:
            raise ValueError(f"Playlist not found: {playlist_id}")
        items = (playlist.get("items") or {}).get("items") or (playlist.get("tracks") or {}).get("items") or []
        tracks = [
            self._build_track(item["track"])
            for item in items
            if item and item.get("track")
        ]
        images = playlist.get("images") or []
        cover_url = images[0].get("url", "") if images and isinstance(images[0], dict) else ""
        owner = playlist.get("owner") or {}
        creator = owner.get("display_name") or owner.get("id") or ""
        model = PlaylistModel(
            spotify_id=playlist["id"],
            name=playlist.get("name", ""),
            cover_url=cover_url,
            length=(playlist.get("items") or {}).get("total") or len(tracks),
            tracks=tracks,
            creator=creator,
            duration_seconds=sum(t.duration_seconds for t in tracks),
        )
        return model

    async def get_album(self, album_id: str) -> AlbumModel:
        album = self.spotify.album(album_id)
        if not album:
            raise ValueError(f"Album not found: {album_id}")

        items = (album.get("items") or {}).get("items") or (album.get("tracks") or {}).get("items") or []
        tracks = [
            self._build_track(item["track"]) if item.get("track") else self._build_album_track(item, album)
            for item in items
            if item
        ]
        images = album.get("images") or []
        cover_url = images[0].get("url", "") if images and isinstance(images[0], dict) else ""
        artists = [
            artist.get("name", "")
            for artist in (album.get("artists") or [])
            if artist and isinstance(artist, dict)
        ]
        model = AlbumModel(
            spotify_id=album["id"],
            name=album.get("name", ""),
            cover_url=cover_url,
            length=(album.get("tracks") or {}).get("total") or len(tracks),
            artists=artists,
            tracks=tracks,
            duration_seconds=sum(t.duration_seconds for t in tracks),
        )
        return model
