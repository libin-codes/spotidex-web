import { useState } from "react";
import { ThemeProvider } from "./contexts/theme-provider";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { TrackCard } from "./components/TrackCard/TrackCard";
import { PlaylistCard } from "./components/PlaylistCard/PlaylistCard";
import { AlbumCard } from "./components/AlbumCard/AlbumCard";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "./components/AppHeader";
import { EmptyOutline } from "./components/EmptyOutline";
import type { SpotifyResource } from "./components/types";
import type { TrackModel } from "@/api/types";



function App() {
  // if (window.location.hash === "#dev") {
  //   return (
  //     <ThemeProvider>
  //       <TrackItemDemo />
  //     </ThemeProvider>
  //   );
  // }

  const [searchResult, setSearchResult] = useState<SpotifyResource | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handlePaste = (resource: SpotifyResource) => {
    setSearchResult(resource);
  };

  const handleClear = () => {
    setSearchResult(null);
  };

  const handleTrackSelect = (track: TrackModel) => {
    setSearchResult({ type: "track", id: track.spotify_id });
  };

  return (
    <ThemeProvider>
      <Toaster />
      <div className="flex h-full flex-col">
        <AppHeader />

        <div className="min-h-0 flex flex-col gap-4 p-4 h-full justify-center items-center ">
          {searchResult == null && <EmptyOutline />}
          {searchResult != null && searchResult.type === "track" && (
            <TrackCard
              trackId={searchResult.id}
              onLoadingChange={setIsLoading}
            />
          )}
          {searchResult != null && searchResult.type === "playlist" && (
            <PlaylistCard
              playlistId={searchResult.id}
              onLoadingChange={setIsLoading}
            />
          )}
          {searchResult != null && searchResult.type === "album" && (
            <AlbumCard
              albumId={searchResult.id}
              onLoadingChange={setIsLoading}
            />
          )}
        </div>
        <SearchBar
          onPaste={handlePaste}
          onSelect={handleTrackSelect}
          onClear={handleClear}
          isLoading={isLoading}
          disabled={searchResult != null}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
