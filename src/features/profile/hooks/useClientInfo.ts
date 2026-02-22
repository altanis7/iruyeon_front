import { useQuery } from "@tanstack/react-query";
import { clientApi } from "../api/profileApi";

/**
 * 클라이언트 상세 정보 조회 Hook (GET /client/:id/info)
 * ProfilePage에서 접근하는 상세/수정 페이지에서 사용
 */
export function useClientInfo(clientId: string) {
  return useQuery({
    queryKey: ["clientInfo", clientId],
    queryFn: () => clientApi.getClientInfoById(clientId),
    enabled: !!clientId,
  });
}
