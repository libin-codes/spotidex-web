import { useAlbum } from "@/hooks/use-album";
import AlbumCardContent from "./AlbumCardContent";
import { AlbumCardSkeleton } from "./AlbumCardSkeleton";
import { useEffect } from "react";

type AlbumCardProps = {
  albumId: string;
  onLoadingChange?: (isLoading: boolean) => void;
  onDownloadingChange?: (isDownloading: boolean) => void;
};

export function AlbumCard({
  albumId,
  onLoadingChange,
  onDownloadingChange,
}: AlbumCardProps) {
  const { data: album, isLoading } = useAlbum(albumId);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  if (isLoading) {
    return <AlbumCardSkeleton />;
  }

  if (!album) {
    return "Failed to load album.";
  }

  return (
    <AlbumCardContent
      album={album}
      key={albumId}
      onDownloadingChange={onDownloadingChange}
    />
  );
}