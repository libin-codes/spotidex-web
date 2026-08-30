import { useAlbum } from "@/hooks/use-album";
import AlbumCardContent from "./AlbumCardContent";
import { AlbumCardSkeleton } from "./AlbumCardSkeleton";

type AlbumCardProps = {
  albumId: string;
};

export function AlbumCard({ albumId }: AlbumCardProps) {
  const { data: album, isLoading } = useAlbum(albumId);
  
  if (isLoading) {
    return <AlbumCardSkeleton />;
  }

  if (!album) {
    return "Failed to load album.";
  }

  return (
    <AlbumCardContent album={album} key={albumId}/>
  );
}