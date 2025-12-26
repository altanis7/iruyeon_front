import { useInfiniteQuery } from "@tanstack/react-query";
import { clientApi } from "../api/profileApi";

export function useMyClients() {
  return useInfiniteQuery({
    queryKey: ["myClients"],
    queryFn: ({ pageParam = 1 }) =>
      clientApi.getMyClients({ page: pageParam, size: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = lastPage.data.currentPage;
      const totalPages = lastPage.data.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
