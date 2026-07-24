export type TrackModel = {
  spotify_id: string;
  name: string;
  cover_url: string;
  artists: string[];
  album_name: string;
  year: string;
  youtube_id: string;
  duration_seconds: number;
};

export type TrackDownloadStatus =
  | "pending"
  | "downloading"
  | "completed"
  | "failed";

export type TrackDownloadProgress = {
  spotify_id: string;
  name: string;
  artists: string[];
  status: TrackDownloadStatus;
  percent: number;
  error: string | null;
  duration_seconds: number;
};

export type DownloadJob = {
  job_id: string;
  name: string;
  type: "track" | "playlist" | "album";
  status: "pending" | "downloading" | "completed" | "failed";
  total: number;
  completed: number;
  failed: number;
  tracks: TrackDownloadProgress[];
  created_at: string;
};

export type PlaylistModel = {
  spotify_id: string;
  name: string;
  cover_url: string;
  creator: string;
  length: number;
  tracks: TrackModel[];
  duration_seconds: number;
};

export type DownloadResponse = {
  job_id: string;
};
