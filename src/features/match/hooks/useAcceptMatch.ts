import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { matchApi, type MatchResponseRequest } from "../api/matchApi";

export function useAcceptMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: MatchResponseRequest) =>
      matchApi.acceptMatch(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches", "received"] });
      queryClient.invalidateQueries({ queryKey: ["match", "alarm"] });
      toast.success("매칭을 수락했습니다.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "매칭 수락에 실패했습니다.");
    },
  });
}
