# main.py
from fastapi import FastAPI
from dotenv import load_dotenv
import os
import yt_dlp

from app.services.SpotidexClient import SpotidexClient
from app.models import TrackModel, PlaylistModel, AlbumModel

load_dotenv()

app = FastAPI(title="Spotidex API", version="1.0")

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

if not client_id or not client_secret:
    raise RuntimeError("CLIENT_ID and CLIENT_SECRET must be set in .env")

spotidex = SpotidexClient(client_id, client_secret)


@app.get("/track/{track_id}", response_model=TrackModel)
async def get_track(track_id: str) -> TrackModel:
    return await spotidex.get_track(track_id)


@app.get("/playlist/{playlist_id}", response_model=PlaylistModel)
async def get_playlist(playlist_id: str) -> PlaylistModel:
    return await spotidex.get_playlist(playlist_id)


@app.get("/album/{album_id}", response_model=AlbumModel)
async def get_album(album_id: str) -> AlbumModel:
    return await spotidex.get_album(album_id)


@app.post("/download/track")
async def download_track(youtube_id: str):
    url = f"https://www.youtube.com/watch?v={youtube_id}"
    ydl_opts: dict = {
        "format": "bestaudio/best",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
        }],
        "outtmpl": "downloads/%(title)s.%(ext)s",
    }
    os.makedirs("downloads", exist_ok=True)
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:  # type: ignore[reportArgumentType]
        ydl.download([url])
    return {"status": "downloaded", "youtube_id": youtube_id}
