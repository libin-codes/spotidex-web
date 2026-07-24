import type { TrackModel } from "@/api/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

type TrackItemProps = {
  track:TrackModel;
  isSelected:boolean;
  onSelectChange?: (isSelected: boolean) => void;
};

export default function TrackItem({
  track,
  isSelected,
  onSelectChange,
}: TrackItemProps) {

  const minutes = Math.floor(track.duration_seconds / 60);
  const remainingSeconds = track.duration_seconds % 60;

  const formatedDuration = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;


  return (
    <Item
      variant="outline"
      className={cn(
        `cursor-pointer border-0 p-3 px-4  rounded-none `,
        isSelected && "bg-secondary",
      )}
      onClick={() => {
        onSelectChange?.(!isSelected);
      }}
    >
      <Checkbox
        checked={isSelected}
        onClick={() => {
          onSelectChange?.(!isSelected);
        }}
      />
      <ItemMedia variant="image">
        <img src={track.cover_url} alt={"Cover Art"} />
      </ItemMedia>
      <ItemContent className="gap-0 pt-0">
        <ItemTitle className="line-clamp-1">{track.name}</ItemTitle>
        <ItemDescription className="line-clamp-1">
          {track.artists.toString()}
        </ItemDescription>
      </ItemContent>
      <ItemContent className="flex-none text-center">
        <ItemDescription>{formatedDuration}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
