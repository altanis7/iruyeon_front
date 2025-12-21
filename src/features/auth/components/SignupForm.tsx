import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ProfilePickerDialog } from "@/features/profile/components/ProfilePickerDialog";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { useCheckEmail } from "@/features/auth/hooks/useCheckEmail";
import { transformSignupData } from "@/features/auth/api/authApi";

// Zod 유효성 검사 스키마
const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "이름은 최소 2자 이상이어야 합니다." })
      .max(50, { message: "이름은 최대 50자까지 입력 가능합니다." }),
    email: z
      .string()
      .min(1, { message: "이메일을 입력하세요." })
      .email({ message: "올바른 이메일 형식을 입력하세요." }),
    phoneNumber: z.string().regex(/^010-\d{4}-\d{4}$/, {
      message: "휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)",
    }),
    company: z
      .string()
      .min(2, { message: "회사명은 최소 2자 이상이어야 합니다." })
      .max(100, { message: "회사명은 최대 100자까지 입력 가능합니다." }),
    gender: z.string().min(1, { message: "성별을 선택하세요." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, {
        message: "비밀번호는 영문과 숫자를 포함해야 합니다.",
      }),
    passwordConfirm: z.string(),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const navigate = useNavigate();
  const { mutate: signup, isPending } = useSignup();
  const { mutate: checkEmail, isPending: isCheckingEmail } = useCheckEmail();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isGenderDialogOpen, setIsGenderDialogOpen] = useState(false);
  const [emailCheckStatus, setEmailCheckStatus] = useState<
    "unchecked" | "available" | "duplicate" | "error"
  >("unchecked");
  const [emailCheckMessage, setEmailCheckMessage] = useState<string>("");

  const genderOptions = ["남성", "여성"];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      gender: "",
    },
  });

  const gender = watch("gender");
  const email = watch("email");

  // 이메일 변경 시 확인 상태 초기화
  useEffect(() => {
    if (emailCheckStatus !== "unchecked") {
      setEmailCheckStatus("unchecked");
      setEmailCheckMessage("");
    }
  }, [email, emailCheckStatus]);

  const onSubmit = (data: SignupFormData) => {
    const apiData = transformSignupData(data);

    signup(apiData, {
      onSuccess: () => {
        setShowSuccessDialog(true);
      },
      onError: error => {
        alert(`회원가입 실패: ${error.message}`);
      },
    });
  };

  const handleEmailCheck = () => {
    if (!email) {
      setEmailCheckStatus("error");
      setEmailCheckMessage("이메일을 입력하세요.");
      return;
    }

    checkEmail(
      { email },
      {
        onSuccess: data => {
          console.log("API 응답:", data);
          setEmailCheckStatus("available");
          setEmailCheckMessage("응답 받음: " + JSON.stringify(data));
        },
        onError: error => {
          console.error("API 에러:", error);
          setEmailCheckStatus("error");
          setEmailCheckMessage(error.message);
        },
      },
    );
  };

  const handleGenderConfirm = (value: string) => {
    setValue("gender", value, { shouldValidate: true });
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <>
      <div className="flex flex-col h-full w-full">
        {/* 상단 헤더 영역 */}
        <div className="relative px-6 pt-safe-top pt-4 pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-4"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-center text-2xl font-bold">회원가입</h1>
        </div>

        {/* 스크롤 가능한 폼 영역 */}
        <div className="flex-1 overflow-y-auto px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
            {/* 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                {...register("name")}
                disabled={isPending}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...register("email")}
                  disabled={isPending || isCheckingEmail}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEmailCheck}
                  disabled={isPending || isCheckingEmail || !email}
                  className="shrink-0"
                >
                  {isCheckingEmail ? "확인 중..." : "중복 확인"}
                </Button>
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
              {emailCheckMessage && (
                <p className="text-sm text-gray-600">{emailCheckMessage}</p>
              )}
            </div>

            {/* 아이디 (휴대폰번호) */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">아이디 (휴대폰번호)</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="010-1234-5678"
                {...register("phoneNumber")}
                disabled={isPending}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* 회사명 */}
            <div className="space-y-2">
              <Label htmlFor="company">회사명</Label>
              <Input
                id="company"
                type="text"
                placeholder="회사명을 입력하세요"
                {...register("company")}
                disabled={isPending}
              />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              )}
            </div>

            {/* 성별 */}
            <div className="space-y-2">
              <Label htmlFor="gender">성별</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsGenderDialogOpen(true)}
                disabled={isPending}
              >
                {gender || "성별을 선택하세요"}
              </Button>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                {...register("password")}
                disabled={isPending}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                {...register("passwordConfirm")}
                disabled={isPending}
              />
              {errors.passwordConfirm && (
                <p className="text-sm text-red-500">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* 하단 고정 버튼 영역 */}
        <div>
          <Button
            type="submit"
            className="w-full rounded-none py-8"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? "처리 중..." : "가입신청"}
          </Button>
        </div>
      </div>

      {/* 성공 다이얼로그 */}
      <Dialog open={showSuccessDialog} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>회원가입 신청 완료</DialogTitle>
            <DialogDescription className="pt-4 text-base">
              가입자의 실명 인증을 위해{" "}
              <span className="font-semibold text-foreground">
                00-0000-0000
              </span>
              으로 문의주시면 감사하겠습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button onClick={handleDialogClose}>확인</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 성별 선택 다이얼로그 */}
      <ProfilePickerDialog
        open={isGenderDialogOpen}
        onOpenChange={setIsGenderDialogOpen}
        title="성별 선택"
        options={genderOptions}
        selectedValue={gender}
        onConfirm={handleGenderConfirm}
      />
    </>
  );
}
