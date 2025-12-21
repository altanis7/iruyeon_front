import { useMutation } from "@tanstack/react-query";
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
  });
};
