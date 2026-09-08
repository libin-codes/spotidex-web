import { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Tabs } from "../ui/tabs";
import type { SpotifyResource } from "../types";
import { useSearch } from "@/hooks/use-search";
import { useSwipeTabs } from "@/hooks/use-swipe-tabs";
import { SearchResultsCardSkeleton } from "./SearchResultsCardSkeleton";
import { SearchResultsHeader } from "./SearchResultsHeader";
import { TracksPanel } from "./panels/TracksPanel";
import { PlaylistsPanel } from "./panels/PlaylistsPanel";
import { AlbumsPanel } from "./panels/AlbumsPanel";

type SearchResultsCardProps = {
  query: string;
  onSelect: (resource: SpotifyResource) => void;
  onLoadingChange?: (isLoading: boolean) => void;
};

const TABS = ["tracks", "playlists", "albums"] as const;

export default function SearchResultsCard({
  query,
  onSelect,
  onLoadingChange,
}: SearchResultsCardProps) {
  const {
    data: results = { tracks: [], playlists: [], albums: [] },
    isLoading,
  } = useSearch(query);

  const { activeTab, handleTabChange, containerRef, containerProps } =
    useSwipeTabs({
      tabs: TABS,
      defaultTab: "tracks",
    });

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  if (isLoading) {
    return <SearchResultsCardSkeleton />;
  }

  const tracksCount = results.tracks.length;
  const playlistsCount = results.playlists.length;
  const albumsCount = results.albums.length;
  const totalCount = tracksCount + playlistsCount + albumsCount;

  return (
    <Card className="w-full h-full min-h-0 no-scrollbar p-0 gap-0" size="sm">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="h-full gap-0"
      >
        <SearchResultsHeader
          totalCount={totalCount}
          tracksCount={tracksCount}
          playlistsCount={playlistsCount}
          albumsCount={albumsCount}
        />

        <CardContent className="flex-1 h-full p-0 min-h-0 overflow-hidden">
          <div
            ref={containerRef}
            {...containerProps}
            className="flex w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar"
            style={{
              scrollSnapType: "x mandatory",
              overscrollBehaviorX: "contain",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <TracksPanel tracks={results.tracks} onSelect={onSelect} />
            <PlaylistsPanel playlists={results.playlists} onSelect={onSelect} />
            <AlbumsPanel albums={results.albums} onSelect={onSelect} />
          </div>
        </CardContent>
      </Tabs>
    </Card>
  );
}
