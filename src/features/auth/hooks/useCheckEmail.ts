import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkEmailAPI } from "@/features/auth/api/authApi";
import type {
  CheckEmailRequest,
  CheckEmailResponse,
} from "@/features/auth/api/authApi";

/**
 * 이메일 중복 확인 mutation hook
 * TanStack Query를 사용한 이메일 중복 확인 API 호출
 */
export const useCheckEmail = () => {
  return useMutation<CheckEmailResponse, Error, CheckEmailRequest>({
    mutationFn: checkEmailAPI,
    onSuccess: (data) => {
      if (data.data) {
        toast.error("이미 사용 중인 이메일입니다.");
      } else {
        toast.success("사용 가능한 이메일입니다.");
      }
    },
    onError: (error) => {
      toast.error(error.message || "이메일 확인에 실패했습니다.");
    },
  });
};
