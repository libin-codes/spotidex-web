import { useQuery } from "@tanstack/react-query";
import { fetchPlaylist } from "@/api/client";

export function usePlaylist(playlistId: string | null) {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => fetchPlaylist(playlistId!),
    enabled: !!playlistId,
    staleTime: Infinity,
  });
}
