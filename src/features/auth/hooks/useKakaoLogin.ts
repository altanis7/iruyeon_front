const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 카카오 로그인 Hook
 * 서버사이드 OAuth2 방식 - 백엔드가 전체 OAuth 플로우 처리
 */
export const useKakaoLogin = () => {
  const redirectToKakao = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
  };

  return { redirectToKakao };
};
