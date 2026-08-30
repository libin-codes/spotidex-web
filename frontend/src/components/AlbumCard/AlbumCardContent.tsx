import { useDownload } from "@/hooks/use-download";
import { useTrackSelection } from "@/hooks/use-track-selection";
import { useCallback } from "react";
import { Card } from "../ui/card";
import TrackContainerHeader from "../TrackContainer/TrackContainerHeader";
import TrackItemList from "../TrackContainer/TrackItemList";
import TrackContainerFooter from "../TrackContainer/TrackContainerFooter";
import type { AlbumModel } from "@/api/types";

export default function AlbumCardContent({
  album,
}: {
  album: AlbumModel;
}) {
  const { selectedIds, selectedCount, isAllSelected, toggle, toggleAll } =
    useTrackSelection(album.tracks.map((t) => t.spotify_id));

  const { job, downloadAlbum } = useDownload();

  const handleDownload = useCallback(() => {
    const selectedTracks = album.tracks.filter((t) =>
      selectedIds.has(t.spotify_id),
    );
    downloadAlbum({
      ...album,
      tracks: selectedTracks,
      length: selectedTracks.length,
    });
  }, [album, selectedIds, downloadAlbum]);

  return (
    <Card className="w-full h-full min-h-0 no-scrollbar p-0 gap-0" size="sm">
      <TrackContainerHeader
        title={album.name}
        subtitle={album.artists.join(", ")}
        cover_url={album.cover_url}
        totalTracks={album.length}
        isAllSelected={isAllSelected}
        onToggleChange={() => toggleAll()}
        selectedCount={selectedCount}
        job={job}
      />
      <TrackItemList
        tracks={album.tracks}
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
