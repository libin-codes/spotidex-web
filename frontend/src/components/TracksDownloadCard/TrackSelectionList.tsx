import { ItemGroup } from "../ui/item";
import TrackItem from "./TrackSelectionItem";
import { CardContent } from "../ui/card";
import type { TrackModel } from "@/api/types";


type TrackSelectionListProps = {
  tracks: TrackModel[];
  onChange?: (selectedIds: string[]) => void;
  onToggle: (id: string) => void;
  selectedIds:Set<string>;
};

export default function TrackSelectionList({ tracks,onToggle,selectedIds }: TrackSelectionListProps) {


  return (
    <CardContent className="flex-1 h-full p-0 min-h-0 ">
      <ItemGroup className="gap-0 h-full overflow-y-auto">
        {tracks.map((track) => {
          return (
            <TrackItem
              key={track.spotify_id}
              track={track}
              isSelected={selectedIds.has(track.spotify_id)}
              onSelectChange={() => onToggle(track.spotify_id)}
            />
          );
        })}
      </ItemGroup>
    </CardContent>
  );
}
