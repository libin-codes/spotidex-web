# spotidex-api — Agent Guide

Flat FastAPI wrapper around the `spotdl` Python library (Spotify downloader). Contains no test, lint, format, or typecheck configuration.

## Run

```bash
uv run uvicorn main:app --reload
```

App serves at `http://127.0.0.1:8000`, docs at `/docs`.

Package manager is `uv`. Use `uv sync`, `uv add`, `uv run` — not pip.

## Codebase

- **Entrypoint**: `main:app` — single-file FastAPI app, no routers or sub-packages.
- **Client**: `SpotidexClient.py` wraps `spotdl` types (`Song`, `Playlist`, `Album`, `query_search`).
- **Models**: `models.py` — Pydantic models with coerced types (year/length/artists as strings).
- **Env**: `.env` with `CLIENT_ID` and `CLIENT_SECRET` (real credentials on disk — **`.env` is NOT in `.gitignore`**).

## Quirks & Gotchas

- **Sync-in-async**: All `async def` routes call synchronous `spotidex.*` methods without `run_in_executor` — blocks the event loop.
- **Search limit**: `get_search_result()` returns `None` for queries ≥30 chars → 500 error.
- **No error handling**: Zero try/except — any network failure or invalid ID = 500.
- **Dead code**: `WebSocket` import unused. `download()` method and `active_downloads` dict exist but are never called from the API.
- **Fragile album endpoint**: `/album/{album_id}` assumes `album.songs[0]` exists.
- **Disabled download URLs**: `SpotidexClient.py` has commented-out (string-literal) download URL logic in all getters.
- **Python 3.14+** required (`.python-version`, `pyproject.toml`).
- **No CI, no pre-commit, no build system** (`[build-system]` missing from `pyproject.toml`).
