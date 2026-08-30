import { useDownload } from "@/hooks/use-download";
import { useTrackSelection } from "@/hooks/use-track-selection";
import { useCallback } from "react";
import { Card } from "../ui/card";
import TrackContainerHeader from "../TrackContainer/TrackContainerHeader";
import TrackItemList from "../TrackContainer/TrackItemList";
import TrackContainerFooter from "../TrackContainer/TrackContainerFooter";
import type { PlaylistModel } from "@/api/types";



export default function PlaylistCardContent({ playlist }: { playlist: PlaylistModel }) {
  const { selectedIds, selectedCount, isAllSelected, toggle, toggleAll } =
    useTrackSelection(playlist.tracks.map((t) => t.spotify_id));

  const { job, downloadPlaylist } = useDownload();

  const handleDownload = useCallback(() => {
    const selectedTracks = playlist.tracks.filter((t) =>
      selectedIds.has(t.spotify_id),
    );
    downloadPlaylist({
      ...playlist,
      tracks: selectedTracks,
      length: selectedTracks.length,
    });
  }, [playlist, selectedIds, downloadPlaylist]);

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
      <TrackContainerFooter job={job} onDownloadClick={handleDownload} selectedCount={selectedCount} />
    </Card>
  );
}
