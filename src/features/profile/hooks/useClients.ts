import { useInfiniteQuery } from "@tanstack/react-query";
import { clientApi } from "../api/profileApi";

/**
 * 인피니티 스크롤로 클라이언트 목록을 가져오는 Hook
 */
export function useClients() {
  return useInfiniteQuery({
    queryKey: ["clients"],
    queryFn: ({ pageParam = 0 }) =>
      clientApi.getClients({ page: pageParam, size: 10 }),
    getNextPageParam: (lastPage, _allPages) => {
      const currentPage = lastPage.data.currentPage;
      const totalPages = lastPage.data.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
  });
}
