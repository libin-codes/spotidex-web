

export type SpotifyResource =
  | { type: "track"; id: string }
  | { type: "playlist"; id: string }
  | { type: "album"; id: string }
  | { type: "search"; query: string };