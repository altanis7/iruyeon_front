import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { signupAPI } from '@/features/auth/api/authApi';
import type { SignupRequest, SignupResponse } from '@/features/auth/api/authApi';

/**
 * 회원가입 mutation hook
 * TanStack Query를 사용한 회원가입 API 호출
 */
export const useSignup = () => {
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signupAPI,
    onSuccess: (data) => {
      console.log('회원가입 성공:', data);
      toast.success('회원가입이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다.');
    },
    onError: (error) => {
      console.error('회원가입 실패:', error);
      toast.error(error.message || '회원가입에 실패했습니다.');
    },
  });
};
