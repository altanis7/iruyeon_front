import { useQuery } from "@tanstack/react-query";
import { matchApi } from "../api/matchApi";

/**
 * 특정 매칭의 채팅 내역을 조회하는 Hook
 */
export function useChat(matchId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ["chat", matchId],
    queryFn: () => matchApi.getChat(matchId),
    enabled,
  });
}
