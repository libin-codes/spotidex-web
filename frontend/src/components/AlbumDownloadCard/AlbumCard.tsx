import { useAlbum } from "@/hooks/use-album";
import { Card } from "../ui/card";
import TracksDownloadHeader from "../TracksDownloadCard/TracksDownloadHeader";
import TrackSelectionList from "../TracksDownloadCard/TrackSelectionList";
import TracksDownloadFooter from "../TracksDownloadCard/TracksDownloadFooter";
import LoadingScreen from "../LoadingScreen";
import { useTrackSelection } from "@/hooks/use-track-selection";
import { useDownload } from "@/hooks/use-download";

type AlbumCardProps = {
  albumId: string;
};

export function AlbumCard({ albumId }: AlbumCardProps) {
  const { data: album, isLoading } = useAlbum(albumId);
  const { selectedIds, selectedCount, isAllSelected, toggle, toggleAll } =
    useTrackSelection(album?.tracks.map((t) => t.spotify_id) ?? []);

  const { downloadStatus } = useDownload();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!album) {
    return "Failed to load album.";
  }

  return (
    <Card className="w-full h-full min-h-0 no-scrollbar p-0 gap-0" size="sm">
      <TracksDownloadHeader
        title={album.name}
        subtitle={album.artists.join(", ")}
        cover_url={album.cover_url}
        totalTracks={album.length}
        totalDuration={album.tracks.reduce(
          (total, item) => total + item.duration_seconds,
          0,
        )}
        type="Album"
        isAllSelected={isAllSelected}
        onToggleChange={() => toggleAll()}
        selectedCount={selectedCount}
      />
      <TrackSelectionList
        tracks={album.tracks}
        onToggle={(id) => {
          toggle(id);
        }}
        selectedIds={selectedIds}
      />
      <TracksDownloadFooter downloadStatus={downloadStatus} />
    </Card>
  );
}