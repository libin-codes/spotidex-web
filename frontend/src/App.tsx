import { TrackCard } from "./components/TrackDownloadCard/TrackCard";
import { TrackListCard } from "./components/TracksDownloadCard/TracksDownloadCard";
import { ThemeProvider } from "./contexts/theme-provider";
import type { Track } from "./components/TracksDownloadCard/types";
import { SearchBar } from "./components/SearchBar";
import { Toaster } from "@/components/ui/sonner";

const sampleTracks: Track[] = [
  {
    id: "1",
    title: "Midnight City Lights",
    artists: ["Neon Dreams"],
    cover_url:
      "https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1",
  },
  {
    id: "2",
    title: "Coffee Shop Conversations",
    artists: ["Neon Dreams"],
    cover_url:
      "https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1",
  },
  {
    id: "3",
    title: "Digital Rain",
    artists: ["Neon Dreams"],
    cover_url:
      "https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1",
  },
  {
    id: "4",
    title: "Lost in Translation",
    artists: ["Neon Dreams"],
    cover_url:
      "https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1",
  },
  {
    id: "5",
    title: "Summer Nights",
    artists: ["Neon Dreams"],
    cover_url:
      "https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1",
  },
];

function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <div className="flex flex-wrap items-start gap-4 p-4">
        <TrackCard
          image="https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1"
          title="Cut To The Feeling"
          artist="Carly Rae Jepsen"
          album="Cut To The Feeling"
          year={2018}
          onDownloadClick={() => {}}
          onSettingsClick={() => {}}
        />

        <TrackListCard
          image="https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1"
          title="Chill Vibes"
          subtitle="Curated by Spotify"
          items={sampleTracks}
          onDownloadClick={(ids) => console.log("Download tracks:", ids)}
          onSettingsClick={() => {}}
        />
        <SearchBar />
      </div>
    </ThemeProvider>
  );
}

export default App;
