import { useAlbum } from "@/hooks/use-album";
import LoadingScreen from "../LoadingScreen";
import AlbumCardContent from "./AlbumCardContent";

type AlbumCardProps = {
  albumId: string;
};

export function AlbumCard({ albumId }: AlbumCardProps) {
  const { data: album, isLoading } = useAlbum(albumId);
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!album) {
    return "Failed to load album.";
  }

  return (
    <AlbumCardContent album={album} key={albumId}/>
  );
}