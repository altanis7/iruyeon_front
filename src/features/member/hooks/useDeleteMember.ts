import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMemberAPI } from "@/features/member/api/memberApi";

export function useDeleteMember() {
  return useMutation({
    mutationFn: deleteMemberAPI,
    onError: (error: Error) => {
      toast.error(error.message || "회원 탈퇴에 실패했습니다.");
    },
  });
}
