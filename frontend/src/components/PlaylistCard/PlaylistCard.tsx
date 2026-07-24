import { usePlaylist } from "@/hooks/use-playlist";
import { Card } from "../ui/card";
import TrackContainerHeader from "../TrackContainer/TrackContainerHeader";
import TrackItemList from "../TrackContainer/TrackItemList";
import TrackContainerFooter from "../TrackContainer/TrackContainerFooter";
import LoadingScreen from "../LoadingScreen";
import { useTrackSelection } from "@/hooks/use-track-selection";
import { useDownload } from "@/hooks/use-download";

type PlaylistCardProps = {
  playlistId: string;
};

export function PlaylistCard({ playlistId }: PlaylistCardProps) {
  const { data: playlist, isLoading } = usePlaylist(playlistId);
  const { selectedIds, selectedCount, isAllSelected, toggle, toggleAll } =
    useTrackSelection(playlist?.tracks.map((t) => t.spotify_id) ?? []);

  const { job, downloadPlaylist } = useDownload()

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!playlist) {
    return "Failed to load playlist.";
  }

  return (
    <Card className="w-full h-full min-h-0 no-scrollbar p-0 gap-0" size="sm">
      <TrackContainerHeader
        title={playlist.name}
        subtitle={playlist.creator}
        cover_url={playlist.cover_url}
        totalTracks={playlist.length}
        totalDuration={playlist.tracks.reduce(
          (total, item) => total + item.duration_seconds,
          0,
        )}
        type="Playlist"
        isAllSelected={isAllSelected}
        onToggleChange={() => toggleAll()}
        selectedCount={selectedCount}
      />
      <TrackItemList
        tracks={playlist.tracks}
        onToggle={(id) => {
          toggle(id);
        }}
        selectedIds={selectedIds}

      />
      <TrackContainerFooter job={job} onDownloadClick={() => downloadPlaylist(playlist)} />
    </Card>
  );
}