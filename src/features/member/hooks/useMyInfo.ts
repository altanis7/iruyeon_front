import { useQuery } from "@tanstack/react-query";
import { getMember } from "@/features/member/api/memberApi";

export function useMyInfo(memberId: string) {
  return useQuery({
    queryKey: ["member", memberId],
    queryFn: () => getMember(memberId),
    enabled: !!memberId,
  });
}
