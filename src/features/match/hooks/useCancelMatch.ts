/**
 * 보낸 매칭 취소 Hook
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matchApi } from "../api/matchApi";

/**
 * 보낸 매칭 취소 mutation
 */
export function useCancelMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => matchApi.cancelSentMatch({ matchId }),
    onSuccess: () => {
      // 보낸 매칭 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["matches", "sent"] });
      // 알림 개수도 갱신
      queryClient.invalidateQueries({ queryKey: ["match", "alarm"] });
    },
  });
}
