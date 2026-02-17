import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { useCheckEmail } from "@/features/auth/hooks/useCheckEmail";
import { transformSignupData } from "@/features/auth/api/authApi";
import { ProfileImageUpload } from "@/features/upload/components/ProfileImageUpload";
import { cn } from "@/lib/utils";

// Zod 유효성 검사 스키마
const signupSchema = z.object({
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
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, {
      message: "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.",
    }),
});

// 비밀번호 유효성 검사 헬퍼
const checkPasswordLength = (password: string) => password.length >= 8;
const checkPasswordComplexity = (password: string) =>
  /[A-Za-z]/.test(password) &&
  /\d/.test(password) &&
  /[!@#$%^&*(),.?":{}|<>]/.test(password);

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const navigate = useNavigate();
  const { mutate: signup, isPending } = useSignup();
  const { mutate: checkEmail, isPending: isCheckingEmail } = useCheckEmail();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [emailCheckStatus, setEmailCheckStatus] = useState<
    "unchecked" | "available" | "duplicate" | "error"
  >("unchecked");
  const [profileImageId, setProfileImageId] = useState<number | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const handleImageChange = (
    imageId: number | null,
    imageUrl: string | null,
  ) => {
    setProfileImageId(imageId);
    setProfileImageUrl(imageUrl);
  };

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
      password: "",
    },
  });

  const gender = watch("gender");
  const email = watch("email");
  const password = watch("password");

  // 비밀번호 유효성 상태
  const isPasswordLengthValid = checkPasswordLength(password || "");
  const isPasswordComplexityValid = checkPasswordComplexity(password || "");

  // 이메일 변경 시 확인 상태 초기화
  useEffect(() => {
    setEmailCheckStatus("unchecked");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const onSubmit = (data: SignupFormData) => {
    // 이메일 중복확인 필수
    if (emailCheckStatus !== "available") {
      alert("이메일 중복확인을 해주세요.");
      return;
    }

    const apiData = transformSignupData(data, profileImageId);

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
      return;
    }

    checkEmail(
      { email },
      {
        onSuccess: response => {
          // data: false = 중복 아님(사용 가능), data: true = 중복(사용 불가)
          if (response.data === false) {
            setEmailCheckStatus("available");
          } else {
            setEmailCheckStatus("duplicate");
          }
        },
        onError: () => {
          setEmailCheckStatus("error");
        },
      },
    );
  };

  const handleGenderChange = (value: string) => {
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
          <h1 className="text-center text-2xl font-bold text-pink-500">
            회원가입
          </h1>
          <p className="text-center text-gray-600 mt-1">
            모든 항목을 입력해주세요
          </p>
        </div>

        {/* 스크롤 가능한 폼 영역 */}
        <div className="flex-1 overflow-y-auto px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
            {/* 프로필 이미지 */}
            <div className="py-4">
              <ProfileImageUpload
                imageUrl={profileImageUrl}
                onImageChange={handleImageChange}
                disabled={isPending}
              />
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <Label htmlFor="email">
                이메일 <span className="text-pink-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...register("email")}
                  disabled={isPending || isCheckingEmail}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleEmailCheck}
                  disabled={isPending || isCheckingEmail || !email}
                  className="shrink-0 bg-pink-500 hover:bg-pink-600 text-white"
                >
                  {isCheckingEmail ? "확인 중..." : "중복확인"}
                </Button>
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
              {emailCheckStatus === "available" && (
                <p className="text-sm text-teal-500">
                  사용 가능한 이메일입니다.
                </p>
              )}
              {emailCheckStatus === "duplicate" && (
                <p className="text-sm text-red-500">
                  이미 사용 중인 이메일입니다.
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <Label htmlFor="password">
                비밀번호 <span className="text-pink-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="8~20자, 영문+숫자+특수문자 포함"
                {...register("password")}
                disabled={isPending}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Check
                    className={cn(
                      "h-4 w-4",
                      isPasswordLengthValid
                        ? "text-teal-500"
                        : "text-gray-400",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm",
                      isPasswordLengthValid
                        ? "text-teal-500"
                        : "text-gray-400",
                    )}
                  >
                    8자 이상
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Check
                    className={cn(
                      "h-4 w-4",
                      isPasswordComplexityValid
                        ? "text-teal-500"
                        : "text-gray-400",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm",
                      isPasswordComplexityValid
                        ? "text-teal-500"
                        : "text-gray-400",
                    )}
                  >
                    영문, 숫자, 특수문자 포함
                  </span>
                </div>
              </div>
            </div>

            {/* 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name">
                이름 <span className="text-pink-500">*</span>
              </Label>
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

            {/* 전화번호 */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                전화번호 <span className="text-pink-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="전화번호를 입력하세요"
                {...register("phoneNumber")}
                disabled={isPending}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* 성별 */}
            <div className="space-y-2">
              <Label htmlFor="gender">
                성별 <span className="text-pink-500">*</span>
              </Label>
              <Select
                value={gender}
                onValueChange={handleGenderChange}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="성별을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="남자">남자</SelectItem>
                  <SelectItem value="여자">여자</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            {/* 회사명 */}
            <div className="space-y-2">
              <Label htmlFor="company">
                회사명 <span className="text-pink-500">*</span>
              </Label>
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
          </form>
        </div>

        {/* 하단 고정 버튼 영역 */}
        <div className="p-4">
          <Button
            type="submit"
            className="w-full py-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? "처리 중..." : "회원가입"}
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
    </>
  );
}
