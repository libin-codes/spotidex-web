import { usePlaylist } from "@/hooks/use-playlist";
import PlaylistCardContent from "./PlaylistCardContent";
import { PlaylistCardSkeleton } from "./PlaylistCardSkeleton";

type PlaylistCardProps = {
  playlistId: string;
};

export function PlaylistCard({ playlistId }: PlaylistCardProps) {
  const { data: playlist, isLoading,  } = usePlaylist(playlistId);

  if (isLoading) {
    return <PlaylistCardSkeleton />;
  }


  if (!playlist) {
    return "Failed to load playlist.";
  }

  return (
    <PlaylistCardContent playlist={playlist} key={playlistId}/>
  );
}