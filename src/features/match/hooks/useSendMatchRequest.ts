import { useMutation } from "@tanstack/react-query";
import { matchApi, type SendMatchRequest } from "../api/matchApi";

export function useSendMatchRequest() {
  return useMutation({
    mutationFn: (request: SendMatchRequest) =>
      matchApi.sendMatchRequest(request),
    onError: (error: Error) => {
      console.error("매칭 신청 실패:", error);
    },
  });
}
