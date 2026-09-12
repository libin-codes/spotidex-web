import type { AlbumSearchResult } from "@/api/types";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ChevronRight } from "lucide-react";

type AlbumResultItemProps = {
  album: AlbumSearchResult;
  onClick: () => void;
};

export function AlbumResultItem({ album, onClick }: AlbumResultItemProps) {
  return (
    <>
      <Item
        key={album.spotify_id}
        variant="outline"
        className="border-0 py-3 pb-4 pt-3 rounded-none cursor-pointer flex-nowrap border-b"
        render={<button type="button" />}
        onClick={onClick}
      >
        <ItemMedia variant="image">
          <img src={album.cover_url} alt="Cover Art" />
        </ItemMedia>
        <ItemContent className="min-w-0 gap-0 pt-0 z-10 text-left">
          <ItemTitle className="line-clamp-1">{album.name}</ItemTitle>
          <ItemDescription className="line-clamp-none flex flex-nowrap items-center gap-1.5 min-w-0">
            {album.artists.length > 0 && (
              <>
                <span className="truncate min-w-0">
                  {album.artists.join(", ")}
                </span>
                <span className="shrink-0 text-muted-foreground/60">•</span>
              </>
            )}
            <span className="shrink-0 whitespace-nowrap font-semibold">
              {`${album.total_tracks} ${album.total_tracks === 1 ? "song" : "songs"}`}
            </span>
          </ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none flex items-center z-10 shrink-0">
          <ChevronRight className="size-4 text-muted-foreground/60 shrink-0" />
        </ItemContent>
      </Item>
    </>
  );
}
