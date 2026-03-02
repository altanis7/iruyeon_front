import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { registerFCMTokenOnLogin } from "@/lib/firebase";
import { toast } from "sonner";
import type { UserRole, UserStatus } from "@/features/auth/api/authApi";

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const role = searchParams.get("role") as UserRole | null;
    const status = searchParams.get("status") as UserStatus | null;

    if (!token || !id || !role || !status) {
      toast.error("로그인 정보가 올바르지 않습니다.");
      navigate("/login", { replace: true });
      return;
    }

    if (role === "ROLE_ANONYMOUS" && status === "PENDING") {
      toast.warning(
        "가입 승인 대기 중입니다. 관리자 승인 후 로그인이 가능합니다.",
      );
      navigate("/login", { replace: true });
      return;
    }

    if (role === "ROLE_DENIED") {
      toast.error("가입이 거부되었습니다. 관리자에게 연락바랍니다.");
      navigate("/login", { replace: true });
      return;
    }

    registerFCMTokenOnLogin();
    login(token, { id, role, status });
  }, [searchParams, navigate, login]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-xl font-semibold">로그인 처리 중...</div>
        <div className="text-sm text-gray-500">잠시만 기다려주세요.</div>
      </div>
    </div>
  );
}
