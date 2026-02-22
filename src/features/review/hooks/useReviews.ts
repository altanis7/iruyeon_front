import { useInfiniteQuery } from "@tanstack/react-query";
import { reviewApi } from "../api/reviewApi";

/**
 * 만남 후기 목록 조회 (무한 스크롤)
 */
export function useReviews(clientId: number) {
  return useInfiniteQuery({
    queryKey: ["reviews", clientId],
    queryFn: ({ pageParam = 0 }) =>
      reviewApi.getReviews({ clientId, page: pageParam, size: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.data.totalPages;
      return allPages.length < totalPages ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: !!clientId,
  });
}
