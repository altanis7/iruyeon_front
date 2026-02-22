import { useInfiniteQuery } from "@tanstack/react-query";
import { matchApi } from "../api/matchApi";

/**
 * 인피니티 스크롤로 받은 매칭 목록을 가져오는 Hook
 */
export function useReceivedMatches() {
  return useInfiniteQuery({
    queryKey: ["matches", "received"],
    queryFn: ({ pageParam = 0 }) =>
      matchApi.getReceivedMatches({ page: pageParam, size: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.data.totalPages;
      return allPages.length < totalPages ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
}
