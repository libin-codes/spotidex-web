import { usePlaylist } from "@/hooks/use-playlist";
import PlaylistCardContent from "./PlaylistCardContent";
import { PlaylistCardSkeleton } from "./PlaylistCardSkeleton";
import { useEffect } from "react";

type PlaylistCardProps = {
  playlistId: string;
  onLoadingChange?: (isLoading: boolean) => void;
  onDownloadingChange?: (isDownloading: boolean) => void;
};

export function PlaylistCard({
  playlistId,
  onLoadingChange,
  onDownloadingChange,
}: PlaylistCardProps) {
  const { data: playlist, isLoading } = usePlaylist(playlistId);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  if (isLoading) {
    return <PlaylistCardSkeleton />;
  }

  if (!playlist) {
    return "Failed to load playlist.";
  }

  return (
    <PlaylistCardContent
      playlist={playlist}
      key={playlistId}
      onDownloadingChange={onDownloadingChange}
    />
  );
}