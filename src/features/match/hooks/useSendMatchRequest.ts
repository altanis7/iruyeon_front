import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { matchApi, type SendMatchRequest } from "../api/matchApi";

export function useSendMatchRequest() {
  return useMutation({
    mutationFn: (request: SendMatchRequest) =>
      matchApi.sendMatchRequest(request),
    onSuccess: () => {
      toast.success("매칭을 신청했습니다.");
    },
    onError: (error: Error) => {
      console.error("매칭 신청 실패:", error);
      toast.error(error.message || "매칭 신청에 실패했습니다.");
    },
  });
}
