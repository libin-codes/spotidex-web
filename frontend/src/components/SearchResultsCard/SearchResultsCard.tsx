import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CardContent } from "../ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import type { TrackModel } from "@/api/types";
import { useTrackSearch } from "@/hooks/use-track-search";
import { SearchResultsCardSkeleton } from "./SearchResultsCardSkeleton";
import { useEffect } from "react";

type SearchResultsCardProps = {
  query: string;
  onSelect: (track: TrackModel) => void;
  onLoadingChange?: (isLoading: boolean) => void;
};

export default function SearchResultsCard({
  query,
  onSelect,
  onLoadingChange,
}: SearchResultsCardProps) {
  const { data: tracks = [], isLoading } = useTrackSearch(query);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  if (isLoading) {
    return <SearchResultsCardSkeleton />;
  }

  return (
    <Card
      className="w-full h-full min-h-0 no-scrollbar p-0 gap-0"
      size="sm"
    >
      <CardHeader className="sticky top-0 z-10 flex flex-col gap-4 p-0 py-4 w-full border-b">
        <div className="px-4 flex gap-4 ">
          <div className="w-full">
            <CardTitle className="truncate flex justify-between w-full items-center ">
              {"Search Results"}
            </CardTitle>
            <CardDescription className="truncate">{`${tracks.length} result${tracks.length !== 1 ? "s" : ""} for "${query}"`}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 h-full p-0 min-h-0 ">
        <div className="flex flex-col gap-0 h-full overflow-y-auto ">
          {tracks.map((track) => (
            <Item
              key={track.spotify_id}
              variant="outline"
              className="border-0 py-3 pb-4 pt-3 rounded-none cursor-pointer"
              render={<button type="button" />}
              onClick={() => onSelect(track)}
            >
              <ItemMedia variant="image">
                <img src={track.cover_url} alt="Cover Art" />
              </ItemMedia>
              <ItemContent className="gap-0 pt-0 z-10">
                <ItemTitle className="line-clamp-1">{track.name}</ItemTitle>
                <ItemDescription className="line-clamp-1">
                  {track.artists.join(", ")}
                </ItemDescription>
              </ItemContent>
             
            </Item>
          ))}
          {tracks.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground p-8">
              No results found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
