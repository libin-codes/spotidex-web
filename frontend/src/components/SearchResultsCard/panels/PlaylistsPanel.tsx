import type { PlaylistSearchResult } from "@/api/types";
import type { SpotifyResource } from "@/components/types";
import { PlaylistResultItem } from "../items/PlaylistResultItem";
import { EmptyResult } from "../EmptyResult";

type PlaylistsPanelProps = {
  playlists: PlaylistSearchResult[];
  onSelect: (resource: SpotifyResource) => void;
};

export function PlaylistsPanel({ playlists, onSelect }: PlaylistsPanelProps) {
  return (
    <div
      className="w-full shrink-0 h-full snap-start snap-always"
      role="tabpanel"
      aria-label="Playlists"
    >
      <div className="flex flex-col gap-0 h-full overflow-y-auto">
        {playlists.map((playlist) => (
          <PlaylistResultItem
            key={playlist.spotify_id}
            playlist={playlist}
            onClick={() =>
              onSelect({ type: "playlist", id: playlist.spotify_id })
            }
          />
        ))}
        {playlists.length === 0 && <EmptyResult message="No playlists found" />}
      </div>
    </div>
  );
}
