import { useQuery } from "@tanstack/react-query";
import { searchTracks } from "@/api/client";

export function useTrackSearch(query: string) {
  return useQuery({
    queryKey: ["track-search", query],
    queryFn: () => searchTracks(query),
    enabled: query.trim().length > 0,
    staleTime: 60_000,
  });
}
