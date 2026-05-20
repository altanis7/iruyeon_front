import { useInfiniteQuery } from "@tanstack/react-query";
import { matchApi } from "../api/matchApi";

export function useMatchMyClients(toClientId: number, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["matchMyClients", toClientId],
    queryFn: ({ pageParam = 0 }) =>
      matchApi.getMyClientsForMatch(toClientId, { page: pageParam, size: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.data.totalPages;
      return allPages.length < totalPages ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: enabled && Boolean(toClientId),
  });
}
