import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkPhoneNumberAPI } from "@/features/auth/api/authApi";
import type {
  CheckPhoneNumberRequest,
  CheckPhoneNumberResponse,
} from "@/features/auth/api/authApi";

/**
 * 전화번호 중복 확인 mutation hook
 * TanStack Query를 사용한 전화번호 중복 확인 API 호출
 */
export const useCheckPhoneNumber = () => {
  return useMutation<CheckPhoneNumberResponse, Error, CheckPhoneNumberRequest>({
    mutationFn: checkPhoneNumberAPI,
    onSuccess: (data) => {
      if (data.data) {
        toast.error("이미 사용 중인 전화번호입니다.");
      } else {
        toast.success("사용 가능한 전화번호입니다.");
      }
    },
    onError: (error) => {
      toast.error(error.message || "전화번호 확인에 실패했습니다.");
    },
  });
};
