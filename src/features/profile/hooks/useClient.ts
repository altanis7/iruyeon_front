import { useQuery } from "@tanstack/react-query";
import { clientApi } from "../api/profileApi";

/**
 * 클라이언트 상세 조회 Hook
 *
 * @param clientId - 클라이언트 ID
 * @returns React Query 결과 (data는 ApiResponse<ClientDetail> 형태)
 */
export function useClient(clientId: string) {
  return useQuery({
    queryKey: ["client", clientId],
    queryFn: () => clientApi.getClientById(clientId),
    enabled: !!clientId, // clientId가 있을 때만 쿼리 실행
  });
}
