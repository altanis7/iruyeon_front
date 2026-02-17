import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
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
        <h1 className="text-2xl font-bold text-center mb-2">이루연 로고</h1>
        <p className="text-sm text-center text-muted-foreground">
          이루연 모바일 애플리케이션
        </p>
      </div>

      {/* 스크롤 가능한 폼 영역 */}
      <div className="flex-1 overflow-y-auto px-6 pt-8">
        <form
          id="login-form"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요."
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="auto-login"
              checked={autoLogin}
              onCheckedChange={checked => setAutoLogin(checked === true)}
              disabled={isLoading}
            />
            <Label
              htmlFor="auto-login"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              자동 로그인
            </Label>
          </div>
        </form>
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="px-6 pb-safe pb-6">
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            form="login-form"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/signup")}
            disabled={isLoading}
          >
            회원가입
          </Button>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          문의가 있으신 경우 02-514-3651로 연락 부탁드립니다.
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
