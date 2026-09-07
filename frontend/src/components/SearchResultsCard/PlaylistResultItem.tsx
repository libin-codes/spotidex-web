import type { PlaylistSearchResult } from "@/api/types";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { ChevronRight } from "lucide-react";

type PlaylistResultItemProps = {
  playlist: PlaylistSearchResult;
  onClick: () => void;
};

export function PlaylistResultItem({
  playlist,
  onClick,
}: PlaylistResultItemProps) {
  return (
    <Item
      key={playlist.spotify_id}
      variant="outline"
      className="border-0 py-3 pb-4 pt-3 rounded-none cursor-pointer flex-nowrap"
      render={<button type="button" />}
      onClick={onClick}
    >
      <ItemMedia variant="image">
        <img src={playlist.cover_url} alt="Cover Art" />
      </ItemMedia>
      <ItemContent className="min-w-0 gap-0 pt-0 z-10 text-left">
        <ItemTitle className="line-clamp-1">{playlist.name}</ItemTitle>
        <ItemDescription className="line-clamp-none flex flex-nowrap items-center gap-1.5 min-w-0">
          {playlist.creator && (
            <>
              <span className="truncate min-w-0">{playlist.creator}</span>
              <span className="shrink-0">•</span>
            </>
          )}
          <span className="shrink-0 whitespace-nowrap font-semibold">
            {`${playlist.total_tracks} ${playlist.total_tracks === 1 ? "song" : "songs"}`}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemContent className="flex-none flex items-center z-10 shrink-0">
        <ChevronRight className="size-4 text-muted-foreground/60 shrink-0" />
      </ItemContent>
    </Item>
  );
}
