from fastapi import FastAPI
from fastapi.staticfiles import  StaticFiles
from dotenv import load_dotenv
load_dotenv()

from app.api.spotify import router as spotify_router
from app.api.download import router as download_router



app = FastAPI(title="Spotidex API", version="1.0")

app.include_router(spotify_router)
app.include_router(download_router)

app.mount("/", StaticFiles(directory="../static", html=True), name="static")