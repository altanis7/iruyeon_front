import { useQuery } from "@tanstack/react-query";
import { clientApi, type PaginationParams } from "../api/profileApi";

export interface UseClientsParams extends PaginationParams {}

/**
 * 페이지네이션된 클라이언트 목록을 가져오는 Hook
 */
export function useClients(params: UseClientsParams) {
  return useQuery({
    queryKey: ["clients", params.page, params.size],
    queryFn: () => clientApi.getClients(params),
    placeholderData: previousData => previousData,
  });
}
