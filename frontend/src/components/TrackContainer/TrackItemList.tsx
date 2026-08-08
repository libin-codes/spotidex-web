import { useMemo } from "react";
import { ItemGroup } from "../ui/item";
import TrackItem from "./TrackItem";
import { CardContent } from "../ui/card";
import type { TrackDownloadProgress, TrackModel } from "@/api/types";

const STATUS_ORDER: Record<string, number> = {
  downloading: 0,
  pending: 1,
  completed: 2,
  failed: 3,
};

type TrackItemListProps = {
  tracks: TrackModel[];
  onChange?: (selectedIds: string[]) => void;
  onToggle: (id: string) => void;
  selectedIds: Set<string>;
  jobTracks?: TrackDownloadProgress[];
};

export default function TrackItemList({ tracks, onToggle, selectedIds, jobTracks }: TrackItemListProps) {
  const trackStatusMap = useMemo(() => {
    const map = new Map<string, TrackDownloadProgress>();
    for (const t of jobTracks ?? []) map.set(t.spotify_id, t);
    return map;
  }, [jobTracks]);

  const visibleTracks = useMemo(() => {
    return jobTracks
      ? tracks.filter((track) => selectedIds.has(track.spotify_id))
      : tracks;
  }, [tracks, jobTracks, selectedIds]);

  const sortedTracks = useMemo(() => {
    return [...visibleTracks].sort((a, b) => {
      const aStatus = trackStatusMap.get(a.spotify_id)?.status ?? "idle";
      const bStatus = trackStatusMap.get(b.spotify_id)?.status ?? "idle";
      return (STATUS_ORDER[aStatus] ?? 4) - (STATUS_ORDER[bStatus] ?? 4);
    });
  }, [visibleTracks, trackStatusMap]);

  return (
    <CardContent className="flex-1 h-full p-0 min-h-0 ">
      <ItemGroup className="gap-0 h-full overflow-y-auto">
        {sortedTracks.map((track) => {
          return (
            <TrackItem
              key={track.spotify_id}
              track={track}
              isSelected={selectedIds.has(track.spotify_id)}
              onSelectChange={() => onToggle(track.spotify_id)}
              trackStatus={trackStatusMap.get(track.spotify_id) ?? "idle"}
            />
          );
        })}
      </ItemGroup>
    </CardContent>
  );
}