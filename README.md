# Spotidex Web

Spotidex is a modern web application for searching, previewing, and downloading Spotify tracks, playlists, and albums. It pairs a high-performance **FastAPI** backend with a **React + TypeScript + Tailwind CSS** frontend, providing real-time download progress tracking via WebSockets and high-quality audio downloads with embedded metadata and cover artwork.

---

## Features

- **Multi-Resource Search with Tabs**: Search across Spotify for tracks, playlists, and albums with a single query, organized into clean tabs with non-truncating song counts and durations.
- **Direct Spotify Link Support**: Paste any Spotify URL (`track`, `playlist`, or `album`) directly into the search bar for instant preview.
- **Rich Card Previews**:
  - **Track Card**: High-resolution cover art, album name, release year, duration, and one-click download.
  - **Playlist & Album Cards**: Scrollable track lists with individual track selection, "Select All" toggle, and batch downloading.
- **Real-Time Download Progress**: Live status updates over WebSockets showing per-track progress percentage, status indicators (pending, downloading, completed, failed), and overall progress.
- **Automated Audio Tagging & Packaging**:
  - Single tracks are delivered as tagged MP3s with embedded ID3 tags (artist, album, year, artwork).
  - Playlists and albums are automatically zipped into a single archive download.
  - Temporary download directories are automatically cleaned up after file delivery.
- **Theme Support**: Dark and light mode toggle powered by `next-themes`.

---

## Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Base UI](https://base-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State & Caching**: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Icons & Notifications**: [Lucide React](https://lucide.dev/) & [Sonner](https://sonner.emilkowal.ski/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) + [Uvicorn](https://www.uvicorn.org/)
- **Package Manager**: [uv](https://docs.astral.sh/uv/) (Python 3.14+)
- **Spotify Metadata**: [Spotipy](https://spotipy.readthedocs.io/)
- **Audio Retrieval**: [yt-dlp](https://github.com/yt-dlp/yt-dlp) & [ytmusicapi](https://ytmusicapi.readthedocs.io/)
- **Audio Tagging**: [Mutagen](https://mutagen.readthedocs.io/)
- **Real-Time Communication**: WebSockets

---

## Project Structure

```
spotidex-web/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI routers (spotify, download)
│   │   ├── models/          # Pydantic data models (spotify, download)
│   │   ├── services/        # Business logic (SpotifyService, DownloadManager, JobStore)
│   │   └── main.py          # FastAPI application entrypoint
│   ├── .env                 # Spotify API credentials (gitignored)
│   ├── pyproject.toml       # Backend dependencies and configuration
│   └── uv.lock
├── frontend/
│   ├── src/
│   │   ├── api/             # API client, types, and WebSocket handlers
│   │   ├── components/      # UI components (TrackCard, PlaylistCard, AlbumCard, SearchResultsCard)
│   │   ├── contexts/        # Theme provider context
│   │   ├── hooks/           # Custom React Query and utility hooks
│   │   ├── lib/             # Utility functions
│   │   ├── App.tsx          # Root application component
│   │   └── main.tsx         # Frontend entrypoint
│   ├── package.json
│   └── vite.config.ts       # Vite config with API proxy
└── README.md
```

---

## Getting Started

### Prerequisites

1. **Python 3.14+** with [`uv`](https://docs.astral.sh/uv/getting-started/installation/) installed.
2. **Node.js** (v20+) with `npm` or `pnpm`.
3. **FFmpeg** installed on your system (required by `yt-dlp` for audio extraction):
   ```bash
   # Ubuntu / Debian
   sudo apt install ffmpeg

   # macOS (Homebrew)
   brew install ffmpeg

   # Arch Linux
   sudo pacman -S ffmpeg
   ```
4. **Spotify Developer Credentials**:
   - Create an application on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
   - Obtain your **Client ID** and **Client Secret**.

---

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file with your Spotify credentials:
   ```env
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   ```

3. Sync dependencies using `uv`:
   ```bash
   uv sync
   ```

4. Start the FastAPI development server:
   ```bash
   uv run uvicorn app.main:app --reload
   ```

The backend will be running at `http://127.0.0.1:8000`. You can explore the interactive API docs at `http://127.0.0.1:8000/docs`.

---

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend will be running at `http://localhost:5173`. Requests to `/api/*` are automatically proxied to the backend at `http://localhost:8000`.

---

## API Reference

### Spotify Metadata
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/search?query={q}` | Multi-resource search returning tracks, playlists, and albums |
| `GET` | `/search/tracks?query={q}` | Search Spotify specifically for tracks |
| `GET` | `/track/{track_id}` | Fetch detailed metadata for a single track |
| `GET` | `/playlist/{playlist_id}` | Fetch playlist metadata and track list |
| `GET` | `/album/{album_id}` | Fetch album metadata and track list |

### Download & Jobs
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/download/track` | Start a single track download job |
| `POST` | `/download/playlist` | Start a batch playlist download job |
| `POST` | `/download/album` | Start a batch album download job |
| `WS` | `/download/{job_id}/status` | WebSocket connection for real-time progress events |
| `GET` | `/download/{job_id}/file` | Download the completed MP3 or ZIP archive |

---

## Development Scripts

### Frontend
```bash
# Start development server
npm run dev

# Type-check and build production bundle
npm run build

# Lint files
npm run lint

# Preview production build locally
npm run preview
```

### Backend
```bash
# Run server with hot reload
uv run uvicorn app.main:app --reload

# Add a new dependency
uv add <package_name>

# Type-check with Pyright
uv run pyright
```

---

## License

This project is for personal and educational use. Please respect copyright laws and Spotify's Terms of Service.
