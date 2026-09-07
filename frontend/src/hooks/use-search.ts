import { useQuery } from "@tanstack/react-query";
import { search } from "@/api/client";

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => search(query),
    enabled: query.trim().length > 0,
    staleTime: 60_000,
  });
}
