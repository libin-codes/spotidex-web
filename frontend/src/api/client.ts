import type { TrackModel, PlaylistModel, AlbumModel, DownloadResponse } from "./types";

const API_BASE = "/api";

export async function fetchTrack(trackId: string): Promise<TrackModel> {
  const res = await fetch(`${API_BASE}/track/${trackId}`);
  if (!res.ok) throw new Error(`Failed to fetch track: ${res.statusText}`);
  return res.json();
}

export async function searchTracks(query: string): Promise<TrackModel[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const res = await fetch(`${API_BASE}/search/tracks?query=${encodeURIComponent(trimmedQuery)}`);
  if (!res.ok) throw new Error(`Failed to search tracks: ${res.statusText}`);
  return res.json();
}

export async function downloadTrack(
  track: TrackModel,
): Promise<DownloadResponse> {
  const res = await fetch(`${API_BASE}/download/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(track),
  });
  if (!res.ok) throw new Error(`Failed to start download: ${res.statusText}`);
  return res.json();
}

export async function fetchPlaylist(
  playlistId: string,
): Promise<PlaylistModel> {
  const res = await fetch(`${API_BASE}/playlist/${playlistId}`);
  if (!res.ok) throw new Error(`Failed to fetch playlist: ${res.statusText}`);
  return res.json();
}

export async function downloadPlaylist(
  playlist: PlaylistModel,
): Promise<DownloadResponse> {
  const res = await fetch(`${API_BASE}/download/playlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(playlist),
  });
  if (!res.ok) throw new Error(`Failed to start download: ${res.statusText}`);
  return res.json();
}

export async function fetchAlbum(
  albumId: string,
): Promise<AlbumModel> {
  const res = await fetch(`${API_BASE}/album/${albumId}`);
  if (!res.ok) throw new Error(`Failed to fetch album: ${res.statusText}`);
  return res.json();
}

export async function downloadAlbum(
  album: AlbumModel,
): Promise<DownloadResponse> {
  const res = await fetch(`${API_BASE}/download/album`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(album),
  });
  if (!res.ok) throw new Error(`Failed to start download: ${res.statusText}`);
  return res.json();
}

export function getDownloadFileUrl(jobId: string): string {
  return `${API_BASE}/download/${jobId}/file`;
}