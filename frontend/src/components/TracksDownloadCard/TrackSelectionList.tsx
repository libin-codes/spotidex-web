import { useState } from "react";
import type { Track } from "./types";
import { ItemGroup } from "../ui/item";
import TrackItem from "./TrackSelectionItem";
import { Checkbox } from "../ui/checkbox";
import { CardContent } from "../ui/card";

type TrackSelectionListProps = {
  tracks: Track[];
  onChange?: (selectedIds: string[]) => void;
};

export default function TrackSelectionList({ tracks, onChange }: TrackSelectionListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(tracks.map((t) => t.id)),
  );

  function toggleItem(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      onChange?.(Array.from(next));
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds(() => {
      const next = selectedIds.size === tracks.length
        ? new Set<string>()
        : new Set(tracks.map((t) => t.id));
      onChange?.(Array.from(next));
      return next;
    });
  }

  return (
    <CardContent className="flex-1">
      <div className="flex justify-between items-center">
        <div className="font-medium">
          Selected {selectedIds.size}/{tracks.length}
        </div>
        <div>
          <Checkbox
            checked={selectedIds.size === tracks.length}
            onClick={() => toggleAll()}
          />
        </div>
      </div>
      <ItemGroup className="gap-0 max-h-40 overflow-y-auto no-scrollbar">
        {tracks.map((track) => {
          return (
            <TrackItem
              key={track.id}
              title={track.title}
              artists={track.artists}
              cover_url={track.cover_url}
              isSelected = {selectedIds.has(track.id)}
              onSelectChange={() => toggleItem(track.id)}
            />
          );
        })}
      </ItemGroup>
    </CardContent>
  );
}
