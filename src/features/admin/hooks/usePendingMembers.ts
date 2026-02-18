import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPendingMembers, approveMember, rejectMember } from "../api/adminApi";
import type { AdminMemberListParams } from "../api/adminApi";

export const pendingMembersKeys = {
  all: ["pendingMembers"] as const,
  list: (params?: AdminMemberListParams) => [...pendingMembersKeys.all, "list", params] as const,
};

export function usePendingMembers(params?: AdminMemberListParams) {
  return useQuery({
    queryKey: pendingMembersKeys.list(params),
    queryFn: () => getPendingMembers(params),
  });
}

export function useApproveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pendingMembersKeys.all });
      toast.success("회원을 승인했습니다.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "회원 승인에 실패했습니다.");
    },
  });
}

export function useRejectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pendingMembersKeys.all });
      toast.success("회원을 거절했습니다.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "회원 거절에 실패했습니다.");
    },
  });
}
