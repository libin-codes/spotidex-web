import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CardContent } from "../ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getTrackDurationString } from "@/lib/utils";
import type { SpotifyResource } from "../types";
import { useSearch } from "@/hooks/use-search";
import { SearchResultsCardSkeleton } from "./SearchResultsCardSkeleton";
import { useEffect } from "react";
import { ChevronRight } from "lucide-react";

type SearchResultsCardProps = {
  query: string;
  onSelect: (resource: SpotifyResource) => void;
  onLoadingChange?: (isLoading: boolean) => void;
};

export default function SearchResultsCard({
  query,
  onSelect,
  onLoadingChange,
}: SearchResultsCardProps) {
  const {
    data: results = { tracks: [], playlists: [], albums: [] },
    isLoading,
  } = useSearch(query);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  if (isLoading) {
    return <SearchResultsCardSkeleton />;
  }

  return (
    <Card className="w-full h-full min-h-0 no-scrollbar p-0 gap-0" size="sm">
      <Tabs defaultValue="tracks" className="h-full gap-0">
        <CardHeader className="sticky top-0 z-10 flex flex-col gap-4 p-0 pt-4 pb-2 w-full">
          <div className="px-4 flex gap-4 ">
            <div className="w-full">
              <CardTitle className="truncate flex justify-between w-full items-center ">
                {"Search Results"}
              </CardTitle>
              <CardDescription className="truncate">{`search results for query "${query}"`}</CardDescription>
            </div>
          </div>
          <div className="px-2 w-full border-y py-4 ">
            <TabsList className="w-full">
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
              <TabsTrigger value="albums">Albums</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>

        <CardContent className="flex-1 h-full p-0 min-h-0">
          <TabsContent value="tracks" className="h-full">
            <div className="flex flex-col gap-0 h-full overflow-y-auto">
              {results.tracks.map((track) => (
                <Item
                  key={track.spotify_id}
                  variant="outline"
                  className="border-0 py-3 pb-4 pt-3 rounded-none cursor-pointer flex-nowrap"
                  render={<button type="button" />}
                  onClick={() =>
                    onSelect({ type: "track", id: track.spotify_id })
                  }
                >
                  <ItemMedia variant="image">
                    <img src={track.cover_url} alt="Cover Art" />
                  </ItemMedia>
                  <ItemContent className="min-w-0 gap-0 pt-0 z-10">
                    <ItemTitle className="line-clamp-1">{track.name}</ItemTitle>
                    <ItemDescription className="line-clamp-1">
                      {track.artists.join(", ")}
                    </ItemDescription>
                  </ItemContent>
                  <ItemContent className="flex-none flex items-center gap-1.5 text-muted-foreground z-10 shrink-0">
                    {getTrackDurationString(track.duration_seconds)}
                  </ItemContent>
                </Item>
              ))}
              {results.tracks.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground p-8">
                  No tracks found
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="h-full">
            <div className="flex flex-col gap-0 h-full overflow-y-auto">
              {results.playlists.map((playlist) => (
                <Item
                  key={playlist.spotify_id}
                  variant="outline"
                  className="border-0 py-3 pb-4 pt-3 rounded-none cursor-pointer flex-nowrap"
                  render={<button type="button" />}
                  onClick={() =>
                    onSelect({ type: "playlist", id: playlist.spotify_id })
                  }
                >
                  <ItemMedia variant="image">
                    <img src={playlist.cover_url} alt="Cover Art" />
                  </ItemMedia>
                  <ItemContent className="min-w-0 gap-0 pt-0 z-10 text-left">
                    <ItemTitle className="line-clamp-1">
                      {playlist.name}
                    </ItemTitle>
                    <ItemDescription className="line-clamp-none flex flex-nowrap items-center gap-1.5 min-w-0">
                      {playlist.creator && (
                        <>
                          <span className="truncate min-w-0">
                            {playlist.creator}
                          </span>
                          <span className="shrink-0 ">•</span>
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
              ))}
              {results.playlists.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground p-8">
                  No playlists found
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="albums" className="h-full">
            <div className="flex flex-col gap-0 h-full overflow-y-auto">
              {results.albums.map((album) => (
                <Item
                  key={album.spotify_id}
                  variant="outline"
                  className="border-0 py-3 pb-4 pt-3 rounded-none cursor-pointer flex-nowrap"
                  render={<button type="button" />}
                  onClick={() =>
                    onSelect({ type: "album", id: album.spotify_id })
                  }
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
                          <span className="shrink-0 text-muted-foreground/60">
                            •
                          </span>
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
              ))}
              {results.albums.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground p-8">
                  No albums found
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
