import { useQuery } from "@tanstack/react-query";
import { clientApi, type FilterSearchParams } from "../api/profileApi";
import { hasActiveFilters } from "../utils/filterOptions";

/**
 * 클라이언트 필터 검색 Hook
 */
export function useSearchClients(params: FilterSearchParams) {
  return useQuery({
    queryKey: ["clients", "search", params],
    queryFn: () => clientApi.searchClients(params),
    enabled: hasActiveFilters(params),
    staleTime: 1000 * 30,
  });
}
