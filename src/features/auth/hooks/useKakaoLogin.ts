import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { kakaoLoginAPI } from "../api/authApi";

const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

/**
 * 카카오 로그인 Hook
 */
export const useKakaoLogin = () => {
  const navigate = useNavigate();

  // 카카오 로그인 페이지로 리다이렉트
  const redirectToKakao = () => {
    const kakaoAuthUrl = `${KAKAO_AUTH_URL}?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  // 인가 코드를 받아 백엔드로 전송
  const mutation = useMutation({
    mutationFn: kakaoLoginAPI,
    onSuccess: (response) => {
      // 토큰 저장
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("status", response.data.status);

      // 상태에 따라 리다이렉트
      if (response.data.status === "PENDING") {
        navigate("/pending");
      } else {
        navigate("/");
      }
    },
    onError: (error: Error) => {
      console.error("카카오 로그인 실패:", error.message);
      alert(error.message);
      navigate("/signup");
    },
  });

  return {
    redirectToKakao,
    handleCallback: mutation.mutate,
    isLoading: mutation.isPending,
  };
};
