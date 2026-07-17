import { useQuery } from "@tanstack/react-query";
import { fetchTrack } from "@/api/client";

export function useTrack(trackId: string | null) {
  return useQuery({
    queryKey: ["track", trackId],
    queryFn: () => fetchTrack(trackId!),
    enabled: !!trackId,
    staleTime: Infinity,
  });
}
