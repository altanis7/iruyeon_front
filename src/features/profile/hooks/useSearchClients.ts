import { useQuery } from "@tanstack/react-query";
import { clientApi, type SearchProfileParams } from "../api/profileApi";

/**
 * 클라이언트 검색 Hook
 */
export function useSearchClients(params: SearchProfileParams) {
  return useQuery({
    queryKey: ["clients", "search", params.keyword],
    queryFn: () => clientApi.searchClients(params),
    enabled: params.keyword.trim().length > 0,
  });
}
