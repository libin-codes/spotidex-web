import { useState } from "react";
import { ThemeProvider } from "./contexts/theme-provider";
import { SearchBar } from "./components/SearchBar";
import { TrackCard } from "./components/TrackDownloadCard/TrackCard";
import { PlaylistCard } from "./components/PlaylistDownloadCard/PlaylistCard";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "./components/AppHeader";
import { EmptyOutline } from "./components/EmptyOutline";

import type { SpotifyResource } from "./components/types";

function App() {
  const [searchResult, setSearchResult] = useState<SpotifyResource | null>(
    null,
  );
  const [searchBarStatus, setSearchBarStatus] = useState<
    "idle" | "loading" | "locked"
  >("idle");

  const handlePaste = (resource: SpotifyResource) => {
    setSearchResult(resource);
    setSearchBarStatus("locked")
  };

  const handleClear = () => {
    setSearchResult(null);
    setSearchBarStatus("idle");
  };

  return (
    <ThemeProvider>
      <Toaster />
      <div className="flex h-full flex-col">
        <AppHeader />

        <div className="flex flex-1 justify-center items-center gap-2 min-h-0  p-4 h-full">
          {searchResult == null && <EmptyOutline />}
          {searchResult != null && searchResult.type === "track" && (   
              <TrackCard trackId={searchResult.id} />
          )}
          {searchResult != null && searchResult.type === "playlist" && (
              <PlaylistCard playlistId={searchResult.id} />
          )}
        </div>
        <SearchBar
          onClear={handleClear}
          onPaste={handlePaste}
          state={searchBarStatus}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
