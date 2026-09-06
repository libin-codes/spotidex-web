import type { RefObject } from "react";
import { Popover, PopoverContent } from "../ui/popover";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import type { TrackModel } from "@/api/types";

type SearchSuggestionsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: RefObject<HTMLDivElement | null>;
  tracks: TrackModel[];
  isFetching: boolean;
  onSelect: (track: TrackModel) => void;
};

export function SearchSuggestions({
  open,
  onOpenChange,
  anchor,
  tracks,
  isFetching,
  onSelect,
}: SearchSuggestionsProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverContent
        side="top"
        sideOffset={12}
        align="center"
        anchor={anchor}
        initialFocus={false}
        className="flex max-h-96 w-(--anchor-width) flex-col overflow-y-auto rounded-3xl p-1.5"
      >
        {tracks.length === 0 && (
          <div className=" text-center">
            
            {isFetching ? "Searching..." : "No tracks found."}
          </div>
        )}
        <ItemGroup className="gap-0 flex-col-reverse overflow-y-auto">
          {tracks.map((track) => (
            <Item
              key={track.spotify_id}
              variant="default"
              render={<button type="button" />}
              className="cursor-pointer p-0 mb-3 mt-3 border-0 hover:bg-accent hover:text-accent-foreground flex-nowrap"
              onClick={() => {
                onSelect(track);
                onOpenChange(false);
              }}
            >
              <ItemMedia variant="image">
                <img src={track.cover_url} alt={track.name} />
              </ItemMedia>
              <ItemContent className="gap-0 truncate">
                <ItemTitle className="truncate">{track.name}</ItemTitle>
                <ItemDescription className="truncate">
                  {track.artists.join(", ")}
                </ItemDescription>
              </ItemContent>
              
            </Item>
            
          ))}
        </ItemGroup>
      </PopoverContent>
    </Popover>
  );
}