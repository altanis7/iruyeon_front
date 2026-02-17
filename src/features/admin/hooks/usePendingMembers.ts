import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    },
  });
}

export function useRejectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pendingMembersKeys.all });
    },
  });
}
