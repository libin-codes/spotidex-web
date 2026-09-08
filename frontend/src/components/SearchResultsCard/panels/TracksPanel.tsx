import type { TrackModel } from "@/api/types";
import type { SpotifyResource } from "@/components/types";
import { TrackResultItem } from "../items/TrackResultItem";
import { EmptyResult } from "../EmptyResult";

type TracksPanelProps = {
  tracks: TrackModel[];
  onSelect: (resource: SpotifyResource) => void;
};

export function TracksPanel({ tracks, onSelect }: TracksPanelProps) {
  return (
    <div
      className="w-full shrink-0 h-full snap-start snap-always"
      role="tabpanel"
      aria-label="Tracks"
    >
      <div className="flex flex-col gap-0 h-full overflow-y-auto">
        {tracks.map((track) => (
          <TrackResultItem
            key={track.spotify_id}
            track={track}
            onClick={() => onSelect({ type: "track", id: track.spotify_id })}
          />
        ))}
        {tracks.length === 0 && <EmptyResult message="No tracks found" />}
      </div>
    </div>
  );
}
