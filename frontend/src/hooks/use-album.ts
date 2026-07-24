import { useQuery } from "@tanstack/react-query";
import { fetchAlbum } from "@/api/client";

export function useAlbum(albumId: string | null) {
  return useQuery({
    queryKey: ["album", albumId],
    queryFn: () => fetchAlbum(albumId!),
    enabled: !!albumId,
    staleTime: Infinity,
  });
}