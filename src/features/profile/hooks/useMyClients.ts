import { useInfiniteQuery } from "@tanstack/react-query";
import { clientApi } from "../api/profileApi";

export function useMyClients() {
  return useInfiniteQuery({
    queryKey: ["myClients"],
    queryFn: ({ pageParam = 0 }) =>
      clientApi.getMyClients({ page: pageParam, size: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.data.totalPages;
      return allPages.length < totalPages ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
}
