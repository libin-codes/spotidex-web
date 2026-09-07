import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  const handlePaste = (res: SpotifyResource) => {
    setResource(res);
  };

  const handleSearch = (query: string) => {
    setResource({ type: "search", query });
  };

  const handleClear = () => {
    setResource(null);
  };

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
            />
          )}
          {resource?.type === "playlist" && (
            <PlaylistCard
              playlistId={resource.id}
              onLoadingChange={setIsLoading}
            />
          )}
          {resource?.type === "album" && (
            <AlbumCard
              albumId={resource.id}
              onLoadingChange={setIsLoading}
            />
          )}
          {resource?.type === "search" && (
            <SearchResultsCard
              query={resource.query}
              onSelect={(selected) => setResource(selected)}
              onLoadingChange={setIsLoading}
            />
          )}
        </div>
        <SearchBar
          onPaste={handlePaste}
          onSearch={handleSearch}
          onClear={handleClear}
          hasResults={resource != null}
          isLoading={isLoading}
          disabled={resource != null}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;