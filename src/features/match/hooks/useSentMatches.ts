/**
 * 보낸 매칭 목록 조회 Hook
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { matchApi } from "../api/matchApi";

/**
 * 보낸 매칭 목록 조회 (무한 스크롤)
 */
export function useSentMatches() {
  return useInfiniteQuery({
    queryKey: ["matches", "sent"],
    queryFn: ({ pageParam = 0 }) =>
      matchApi.getSentMatches({ page: pageParam, size: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.data.totalPages;
      return allPages.length < totalPages ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
}
