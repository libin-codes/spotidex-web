import { usePlaylist } from "@/hooks/use-playlist";
import { Card } from "../ui/card";
import TrackContainerHeader from "../TrackContainer/TrackContainerHeader";
import TrackItemList from "../TrackContainer/TrackItemList";
import TrackContainerFooter from "../TrackContainer/TrackContainerFooter";
import LoadingScreen from "../LoadingScreen";
import { useTrackSelection } from "@/hooks/use-track-selection";
import { useDownload } from "@/hooks/use-download";
import { useCallback } from "react";

type PlaylistCardProps = {
  playlistId: string;
};

export function PlaylistCard({ playlistId }: PlaylistCardProps) {
  const { data: playlist, isLoading } = usePlaylist(playlistId);
  const { selectedIds, selectedCount, isAllSelected, toggle, toggleAll } =
    useTrackSelection(playlist?.tracks.map((t) => t.spotify_id) ?? []);

  const { job, downloadPlaylist } = useDownload()

  const handleDownload = useCallback(() => {
    if (!playlist) return;
    const selectedTracks = playlist.tracks.filter((t) =>
      selectedIds.has(t.spotify_id),
    );
    downloadPlaylist({
      ...playlist,
      tracks: selectedTracks,
      length: selectedTracks.length,
    });
  }, [playlist, selectedIds, downloadPlaylist]);

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
        isAllSelected={isAllSelected}
        onToggleChange={() => toggleAll()}
        selectedCount={selectedCount}
        job={job}
      />
      <TrackItemList
        tracks={playlist.tracks}
        onToggle={(id) => {
          toggle(id);
        }}
        selectedIds={selectedIds}
        jobTracks={job?.tracks}
      />
      <TrackContainerFooter job={job} onDownloadClick={handleDownload} />
    </Card>
  );
}