import { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent } from "../ui/tabs";
import type { SpotifyResource } from "../types";
import { useSearch } from "@/hooks/use-search";
import { SearchResultsCardSkeleton } from "./SearchResultsCardSkeleton";
import { SearchResultsHeader } from "./SearchResultsHeader";
import { TrackResultItem } from "./TrackResultItem";
import { PlaylistResultItem } from "./PlaylistResultItem";
import { AlbumResultItem } from "./AlbumResultItem";
import { EmptyResult } from "./EmptyResult";

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
        <SearchResultsHeader query={query} />

        <CardContent className="flex-1 h-full p-0 min-h-0">
          <TabsContent value="tracks" className="h-full">
            <div className="flex flex-col gap-0 h-full overflow-y-auto">
              {results.tracks.map((track) => (
                <TrackResultItem
                  key={track.spotify_id}
                  track={track}
                  onClick={() =>
                    onSelect({ type: "track", id: track.spotify_id })
                  }
                />
              ))}
              {results.tracks.length === 0 && (
                <EmptyResult message="No tracks found" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="h-full">
            <div className="flex flex-col gap-0 h-full overflow-y-auto">
              {results.playlists.map((playlist) => (
                <PlaylistResultItem
                  key={playlist.spotify_id}
                  playlist={playlist}
                  onClick={() =>
                    onSelect({ type: "playlist", id: playlist.spotify_id })
                  }
                />
              ))}
              {results.playlists.length === 0 && (
                <EmptyResult message="No playlists found" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="albums" className="h-full">
            <div className="flex flex-col gap-0 h-full overflow-y-auto">
              {results.albums.map((album) => (
                <AlbumResultItem
                  key={album.spotify_id}
                  album={album}
                  onClick={() =>
                    onSelect({ type: "album", id: album.spotify_id })
                  }
                />
              ))}
              {results.albums.length === 0 && (
                <EmptyResult message="No albums found" />
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
