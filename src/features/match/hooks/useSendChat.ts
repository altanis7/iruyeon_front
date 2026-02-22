import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { matchApi, type SendChatRequest } from "../api/matchApi";

/**
 * 채팅 메시지 전송 Mutation Hook
 */
export function useSendChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SendChatRequest) => matchApi.sendChat(request),
    onSuccess: (_data, variables) => {
      // 채팅 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["chat", variables.matchId] });
      // 매칭 목록의 newChatCnt 갱신
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
    onError: () => {
      toast.error("메시지 전송에 실패했습니다.");
    },
  });
}
