import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewApi, type CreateReviewRequest } from "../api/reviewApi";

/**
 * 만남 후기 작성 Mutation Hook
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateReviewRequest) => reviewApi.createReview(request),
    onSuccess: () => {
      toast.success("후기가 등록되었습니다");
      // 후기 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => {
      toast.error("후기 등록에 실패했습니다");
    },
  });
}
