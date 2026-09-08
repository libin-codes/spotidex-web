import type { TrackModel } from "@/api/types";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { getTrackDurationString } from "@/lib/utils";

type TrackResultItemProps = {
  track: TrackModel;
  onClick: () => void;
};

export function TrackResultItem({ track, onClick }: TrackResultItemProps) {
  return (
    <>
      <Item
        variant="outline"
        className="border-0 py-3 pb-4 pt-3 rounded-none cursor-pointer flex-nowrap"
        render={<button type="button" />}
        onClick={onClick}
      >
        <ItemMedia variant="image">
          <img src={track.cover_url} alt="Cover Art" />
        </ItemMedia>
        <ItemContent className="min-w-0 gap-0 pt-0 z-10 text-left">
          <ItemTitle className="line-clamp-1">{track.name}</ItemTitle>
          <ItemDescription className="line-clamp-1">
            {track.artists.join(", ")}
          </ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none flex items-center gap-1.5 text-muted-foreground z-10 shrink-0">
          {getTrackDurationString(track.duration_seconds)}
        </ItemContent>
      </Item>
      <ItemSeparator className={"m-0"} />
    </>
  );
}
