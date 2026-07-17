import type { TrackModel, DownloadResponse } from "./types";

const API_BASE = "/api";

export async function fetchTrack(trackId: string): Promise<TrackModel> {
  const res = await fetch(`${API_BASE}/track/${trackId}`);
  if (!res.ok) throw new Error(`Failed to fetch track: ${res.statusText}`);
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

export function getDownloadFileUrl(jobId: string): string {
  return `${API_BASE}/download/${jobId}/file`;
}
