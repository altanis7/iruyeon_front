import { useMutation } from '@tanstack/react-query';
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
    },
    onError: (error) => {
      console.error('회원가입 실패:', error);
    },
  });
};
