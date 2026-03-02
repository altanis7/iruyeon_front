import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useKakaoLogin } from "@/features/auth/hooks/useKakaoLogin";

export default function KakaoCallbackPage() {
  const [searchParams] = useSearchParams();
  const { handleCallback, isLoading } = useKakaoLogin();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("카카오 로그인 취소:", error);
      alert("카카오 로그인이 취소되었습니다.");
      window.location.href = "/signup";
      return;
    }

    if (code) {
      handleCallback(code);
    } else {
      alert("인가 코드를 받지 못했습니다.");
      window.location.href = "/signup";
    }
  }, [searchParams, handleCallback]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-xl font-semibold">
          {isLoading ? "카카오 로그인 처리 중..." : "로그인 중..."}
        </div>
        <div className="text-sm text-gray-500">잠시만 기다려주세요.</div>
      </div>
    </div>
  );
}
