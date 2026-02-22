import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateMember,
  type UpdateMemberRequest,
} from "@/features/member/api/memberApi";

export function useUpdateMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: string;
      data: UpdateMemberRequest;
    }) => updateMember(memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["member", variables.memberId],
      });
      toast.success("내 정보가 수정되었습니다.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "정보 수정에 실패했습니다.");
    },
  });
}
