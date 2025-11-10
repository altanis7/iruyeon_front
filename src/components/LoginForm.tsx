import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-sm", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">이루연 로고</CardTitle>
          <CardDescription>이루연 모바일 애플리케이션</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">아이디</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="휴대폰 번호를 입력하세요."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>

                <Input id="password" type="password" required />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="auto-login" />
                <Label
                  htmlFor="auto-login"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  자동 로그인
                </Label>
              </div>
              <div className="grid gap-2">
                <Button type="submit" className="w-full">
                  로그인
                </Button>
                <Button variant="outline" className="w-full">
                  회원가입
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              문의가 있으신 경우 02-514-3651로 연락 부탁드립니다.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
