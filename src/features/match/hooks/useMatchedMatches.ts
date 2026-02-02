/**
 * 매칭 완료 목록 조회 Hook
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { matchApi } from "../api/matchApi";

/**
 * 매칭 완료 목록 조회 (무한 스크롤)
 */
export function useMatchedMatches() {
  return useInfiniteQuery({
    queryKey: ["matches", "matched"],
    queryFn: ({ pageParam = 0 }) =>
      matchApi.getMatchedMatches({ page: pageParam, size: 10 }),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.currentPage;
      const totalPages = lastPage.data.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
  });
}
