import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { matchApi, type MatchResponseRequest } from "../api/matchApi";

export function useRejectMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: MatchResponseRequest) =>
      matchApi.rejectMatch(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches", "received"] });
      queryClient.invalidateQueries({ queryKey: ["match", "alarm"] });
      toast.success("매칭을 거절했습니다.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "매칭 거절에 실패했습니다.");
    },
  });
}
