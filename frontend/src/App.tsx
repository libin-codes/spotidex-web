import { useState, useEffect, useCallback } from "react";
import { ThemeProvider } from "./contexts/theme-provider";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { TrackCard } from "./components/TrackCard/TrackCard";
import { PlaylistCard } from "./components/PlaylistCard/PlaylistCard";
import { AlbumCard } from "./components/AlbumCard/AlbumCard";
import SearchResultsCard from "./components/SearchResultsCard/SearchResultsCard";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "./components/AppHeader";
import { EmptyOutline } from "./components/EmptyOutline";
import type { SpotifyResource } from "./components/types";

function App() {
  const [resource, setResource] = useState<SpotifyResource | null>(null);
  const [lastSearch, setLastSearch] = useState<{
    type: "search";
    query: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);

  const handlePaste = (res: SpotifyResource) => {
    setResource(res);
    setLastSearch(null);
    setIsDownloading(false);
    window.history.pushState({ resource: res }, "");
  };

  const handleSearch = (query: string) => {
    const searchRes = { type: "search" as const, query };
    setResource(searchRes);
    setLastSearch(searchRes);
    setIsDownloading(false);
    window.history.pushState({ resource: searchRes }, "");
  };

  const handleSelect = (selected: SpotifyResource) => {
    setResource(selected);
    setIsDownloading(false);
    window.history.pushState(
      {
        resource: selected,
        fromSearch: true,
        lastSearchQuery: lastSearch?.query,
      },
      ""
    );
  };

  const handleBack = useCallback(() => {
    setIsDownloading(false);
    if (window.history.state?.fromSearch) {
      window.history.back();
    } else if (lastSearch) {
      setResource(lastSearch);
      window.history.pushState({ resource: lastSearch }, "");
    }
  }, [lastSearch]);

  const handleClear = () => {
    setResource(null);
    setLastSearch(null);
    setIsDownloading(false);
    window.history.pushState(null, "");
  };

  // Sync state with browser/mobile back and forward navigation
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const stateResource = e.state?.resource as SpotifyResource | undefined;
      setResource(stateResource ?? null);
      setIsDownloading(false);

      if (stateResource?.type === "search") {
        setLastSearch(stateResource);
      } else if (e.state?.fromSearch && e.state?.lastSearchQuery) {
        setLastSearch({ type: "search", query: e.state.lastSearchQuery });
      } else if (!stateResource) {
        setLastSearch(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const canGoBack =
    resource != null && resource.type !== "search" && lastSearch != null;

  return (
    <ThemeProvider>
      <Toaster />
      <div className="flex h-full flex-col">
        <AppHeader />

        <div className="min-h-0 flex flex-col gap-4 p-4 h-full justify-center items-center ">
          {resource == null && <EmptyOutline />}
          {resource?.type === "track" && (
            <TrackCard
              trackId={resource.id}
              onLoadingChange={setIsLoading}
              onDownloadingChange={setIsDownloading}
            />
          )}
          {resource?.type === "playlist" && (
            <PlaylistCard
              playlistId={resource.id}
              onLoadingChange={setIsLoading}
              onDownloadingChange={setIsDownloading}
            />
          )}
          {resource?.type === "album" && (
            <AlbumCard
              albumId={resource.id}
              onLoadingChange={setIsLoading}
              onDownloadingChange={setIsDownloading}
            />
          )}
          {resource?.type === "search" && (
            <SearchResultsCard
              query={resource.query}
              onSelect={handleSelect}
              onLoadingChange={setIsLoading}
            />
          )}
        </div>
        <SearchBar
          onPaste={handlePaste}
          onSearch={handleSearch}
          onClear={handleClear}
          canGoBack={canGoBack}
          onBack={handleBack}
          activeQuery={
            resource?.type === "search"
              ? resource.query
              : lastSearch?.query
          }
          hasResults={resource != null}
          isLoading={isLoading}
          isDownloading={isDownloading}
          disabled={resource != null}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;