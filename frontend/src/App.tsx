import { useState } from "react";
import { ThemeProvider } from "./contexts/theme-provider";
import { SearchBar } from "./components/SearchBar";
import { TrackCard } from "./components/TrackCard/TrackCard";
import { PlaylistCard } from "./components/PlaylistCard/PlaylistCard";
import { AlbumCard } from "./components/AlbumCard/AlbumCard";
import TrackItemDemo from "./pages/TrackItemDemo";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "./components/AppHeader";
import { EmptyOutline } from "./components/EmptyOutline";

import type { SpotifyResource } from "./components/types";
import { Button } from "./components/ui/button";
import { X } from "lucide-react";


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
        <SearchBar
          onClear={handleClear}
          onPaste={handlePaste}
          state={searchBarStatus}
        />

        <div className="min-h-0 flex flex-col gap-4 p-4 h-full">
          {searchResult == null && <EmptyOutline />}
          {searchResult != null && searchResult.type === "track" && (
            <TrackCard trackId={searchResult.id} />
          )}
          {searchResult != null && searchResult.type === "playlist" && (
            <PlaylistCard playlistId={searchResult.id} />
          )}
          {searchResult != null && searchResult.type === "album" && (
            <AlbumCard albumId={searchResult.id} />
          )}
       
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
