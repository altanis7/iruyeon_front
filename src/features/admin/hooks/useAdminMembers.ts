import { useQuery } from "@tanstack/react-query";
import { getAdminMembers } from "../api/adminApi";
import type { AdminMemberListParams } from "../api/adminApi";

export const adminKeys = {
  all: ["admin"] as const,
  members: () => [...adminKeys.all, "members"] as const,
  memberList: (params?: AdminMemberListParams) =>
    [...adminKeys.members(), params] as const,
};

export function useAdminMembers(params?: AdminMemberListParams) {
  return useQuery({
    queryKey: adminKeys.memberList(params),
    queryFn: () => getAdminMembers(params),
  });
}
