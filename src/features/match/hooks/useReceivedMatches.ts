import { useInfiniteQuery } from "@tanstack/react-query";
import { matchApi } from "../api/matchApi";

/**
 * 인피니티 스크롤로 받은 매칭 목록을 가져오는 Hook
 */
export function useReceivedMatches() {
  return useInfiniteQuery({
    queryKey: ["matches", "received"],
    queryFn: ({ pageParam = 1 }) =>
      matchApi.getReceivedMatches({ page: pageParam, size: 10 }),
    getNextPageParam: (lastPage, _allPages) => {
      const currentPage = lastPage.data.currentPage;
      const totalPages = lastPage.data.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
