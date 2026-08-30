import os
from collections.abc import Callable
from typing import Mapping, Any, cast

import requests
import yt_dlp
from mutagen.id3 import ID3, APIC, TIT2, TPE1, TALB, TDRC
from mutagen.mp3 import MP3
from ytmusicapi import YTMusic

from app.models import TrackModel

MAX_CONCURRENT = 5
MAX_RETRIES = 3

_ytmusic = YTMusic()


def _resolve_youtube_id(track: TrackModel) -> str:
    query = f"{track.name} {track.artists[0]}" if track.artists else track.name
    results = _ytmusic.search(query, filter="songs", limit=1)
    if not results or "videoId" not in results[0]:
        raise ValueError(f"No YouTube match found for '{track.name}'")
    return results[0]["videoId"]


def download_track(
    track: TrackModel, output_dir: str, on_progress: Callable[[float], None]
) -> None:
    youtube_id = _resolve_youtube_id(track)
    url = f"https://www.youtube.com/watch?v={youtube_id}"
    filepath = os.path.join(output_dir, f"{track.name} - {track.artists[0]}")

    def progress_hook(d: Mapping[str, Any]) -> None:
        if d.get("status") == "downloading":
            downloaded = float(cast("int | float", d.get("downloaded_bytes", 0)))
            total_raw = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
            total = float(cast("int | float", total_raw))
            if total > 0:
                on_progress(downloaded / total * 97)
        elif d.get("status") == "finished":
            on_progress(97.0)

    ydl_opts = {
        "format": "bestaudio/best",
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "320",
            },
        ],
        "outtmpl": filepath,
        "quiet": True,
        "no_warnings": True,
        "progress_hooks": [progress_hook],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:  # pyright: ignore[reportArgumentType]
        ydl.download([url])

    _embed_metadata(filepath + ".mp3", track)


def _embed_metadata(mp3_path: str, track: TrackModel) -> None:
    audio = MP3(mp3_path, ID3=ID3)

    if audio.tags is None:
        audio.add_tags()

    tags = audio.tags
    assert tags is not None

    tags.add(TIT2(encoding=3, text=[track.name]))
    tags.add(TPE1(encoding=3, text=[", ".join(track.artists)]))
    tags.add(TALB(encoding=3, text=[track.album_name]))
    tags.add(TDRC(encoding=3, text=[track.year]))

    if track.cover_url:
        cover_data = requests.get(track.cover_url, timeout=10).content
        tags.add(
            APIC(
                encoding=3,
                mime="image/jpeg",
                type=3,
                desc="Cover",
                data=cover_data,
            )
        )

    audio.save()