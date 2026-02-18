import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Heart, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ToggleSwitch } from "@/shared/components/ui/toggle-switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FloatingLabelInput } from "@/features/profile/components/FloatingLabelInput";
import { useAuth, getAutoLoginSetting } from "@/features/auth/hooks/useAuth";
import { loginAPI } from "@/features/auth/api/authApi";

type StatusDialogType = "pending" | "denied" | null;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(() => getAutoLoginSetting());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusDialog, setStatusDialog] = useState<StatusDialogType>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginAPI({ email, password });
      if (response.data && response.data.token) {
        const { id, token, role, status } = response.data;

        // 승인 대기 상태 (ROLE_ANONYMOUS)
        if (role === "ROLE_ANONYMOUS" && status === "PENDING") {
          setStatusDialog("pending");
          return;
        }

        // 승인 거부 상태 (ROLE_DENIED)
        if (role === "ROLE_DENIED") {
          setStatusDialog("denied");
          return;
        }

        // 승인된 사용자 (ROLE_MEMBER, ROLE_ADMIN)
        if (role === "ROLE_MEMBER" || role === "ROLE_ADMIN") {
          login(
            token,
            { id: String(id), role, status },
            autoLogin,
          );
          return;
        }

        // 예상치 못한 상태
        setError("로그인 응답이 올바르지 않습니다.");
      } else {
        setError("로그인 응답이 올바르지 않습니다.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col h-full w-full", className)} {...props}>
      {/* 상단 헤더 영역 */}
      <div className="px-6 pt-safe-top pt-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <Heart className="w-9 h-9 text-gray-500" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">이루연</h1>
          <p className="text-sm text-muted-foreground">
            당신의 소중한 인연을 이어드립니다
          </p>
        </div>
      </div>

      {/* 스크롤 가능한 폼 영역 */}
      <div className="flex-1 overflow-y-auto px-6 pt-8">
        <form
          id="login-form"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <FloatingLabelInput
            label="이메일"
            type="email"
            value={email}
            onChange={setEmail}
            disabled={isLoading}
          />

          <FloatingLabelInput
            label="비밀번호"
            type="password"
            value={password}
            onChange={setPassword}
            disabled={isLoading}
          />

          <div className="flex items-center gap-3 py-1">
            <ToggleSwitch
              checked={autoLogin}
              onCheckedChange={setAutoLogin}
              disabled={isLoading}
            />
            <span className="text-sm text-foreground">자동 로그인</span>
          </div>
        </form>
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="px-6 pb-safe pb-6">
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            form="login-form"
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl border-gray-200"
            onClick={() => navigate("/signup")}
            disabled={isLoading}
          >
            회원가입
          </Button>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          문의사항이 있으신 경우 02-514-3651로
          <br />
          연락 부탁드립니다.
        </div>
      </div>

      {/* 승인 대기 다이얼로그 */}
      <Dialog
        open={statusDialog === "pending"}
        onOpenChange={() => setStatusDialog(null)}
      >
        <DialogContent className="max-w-[320px]">
          <DialogHeader className="items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-2">
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
            <DialogTitle>승인 대기 중</DialogTitle>
            <DialogDescription className="text-center">
              가입 승인 대기 중입니다.
              <br />
              관리자 승인 후 로그인이 가능합니다.
            </DialogDescription>
          </DialogHeader>
          <Button
            className="w-full mt-2"
            onClick={() => setStatusDialog(null)}
          >
            확인
          </Button>
        </DialogContent>
      </Dialog>

      {/* 승인 거부 다이얼로그 */}
      <Dialog
        open={statusDialog === "denied"}
        onOpenChange={() => setStatusDialog(null)}
      >
        <DialogContent className="max-w-[320px]">
          <DialogHeader className="items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <DialogTitle>승인 거부</DialogTitle>
            <DialogDescription className="text-center">
              가입이 거부되었습니다.
              <br />
              문의가 필요하시면 관리자에게 연락해주세요.
            </DialogDescription>
          </DialogHeader>
          <Button
            className="w-full mt-2"
            onClick={() => setStatusDialog(null)}
          >
            확인
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
