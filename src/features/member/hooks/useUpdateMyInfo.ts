import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    },
  });
}
