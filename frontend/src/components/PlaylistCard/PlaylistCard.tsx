import { usePlaylist } from "@/hooks/use-playlist";
import LoadingScreen from "../LoadingScreen";
import PlaylistCardContent from "./PlaylistCardContent";

type PlaylistCardProps = {
  playlistId: string;
};

export function PlaylistCard({ playlistId }: PlaylistCardProps) {
  const { data: playlist, isLoading,  } = usePlaylist(playlistId);

  if (isLoading) {
    return <LoadingScreen />;
  }


  if (!playlist) {
    return "Failed to load playlist.";
  }

  return (
    <PlaylistCardContent playlist={playlist} key={playlistId}/>
  );
}