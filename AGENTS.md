# spotidex — Agent Guide

Monorepo: FastAPI backend (Python) + React frontend (TypeScript).

## Structure

```
spotidex/
├── backend/       # FastAPI + spotdl wrapper
│   ├── app/
│   ├── .env       # Spotify CLIENT_ID, CLIENT_SECRET (gitignored)
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/      # React + TypeScript + Tailwind + shadcn (to be scaffolded)
├── static/        # Legacy test page (will be removed after frontend is built)
├── .gitignore
└── AGENTS.md
```

## Backend

### Run

```bash
cd backend && uv run uvicorn app.main:app --reload
```

App serves at `http://127.0.0.1:8000`, docs at `/docs`.

Package manager is `uv`. Use `uv sync`, `uv add`, `uv run` — not pip.

### Codebase

- **Entrypoint**: `app.main:app` — single-file FastAPI app, no routers or sub-packages.
- **Services**: `app/services/` — `SpotifyService` (API data), `downloader` (yt_dlp), `JobStore` (jobs/queues), `CleanupManager` (temp dirs/timers), `DownloadManager` (facade).
- **Models**: `app/models/` — `spotify.py` (TrackModel, PlaylistModel, AlbumModel), `download.py` (job/status enums + models).
- **Env**: `.env` with `CLIENT_ID` and `CLIENT_SECRET` (real credentials on disk, gitignored).

### Quirks & Gotchas

- **Sync-in-async**: All `async def` routes call synchronous `spotidex.*` methods without `run_in_executor` — blocks the event loop.
- **Search limit**: `get_search_result()` returns `None` for queries ≥30 chars → 500 error.
- **No error handling**: Zero try/except — any network failure or invalid ID = 500.
- **Dead code**: `download()` method and `active_downloads` dict exist but are never called from the API.
- **Fragile album endpoint**: `/album/{album_id}` assumes `album.songs[0]` exists.
- **Python 3.14+** required (`.python-version`, `pyproject.toml`).
- **No CI, no pre-commit, no build system** (`[build-system]` missing from `pyproject.toml`).

## Frontend

Not yet scaffolded. Planned stack: React + TypeScript + Tailwind CSS + shadcn/ui.
Vite dev server on port 5173, proxying API requests to `:8000`.
