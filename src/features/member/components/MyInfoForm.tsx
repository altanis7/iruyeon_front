import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProfileImageUpload } from "@/features/upload/components/ProfileImageUpload";
import { FloatingLabelInput } from "@/features/profile/components/FloatingLabelInput";
import { GenderToggle } from "@/features/profile/components/GenderToggle";
import { useMyInfo } from "@/features/member/hooks/useMyInfo";
import { useUpdateMyInfo } from "@/features/member/hooks/useUpdateMyInfo";
import {
  formatPhoneForDisplay,
  formatPhoneForApi,
  type UpdateMemberRequest,
} from "@/features/member/api/memberApi";
import { cn } from "@/lib/utils";

// 비밀번호 유효성 검사 헬퍼
const checkPasswordLength = (password: string) => password.length >= 8;
const checkPasswordComplexity = (password: string) =>
  /[A-Za-z]/.test(password) &&
  /\d/.test(password) &&
  /[!@#$%^&*(),.?":{}|<>]/.test(password);

const myInfoSchema = z
  .object({
    email: z.string().email(),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          return (
            val.length >= 8 &&
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(val)
          );
        },
        { message: "비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다." },
      ),
    newPasswordConfirm: z.string().optional(),
    name: z
      .string()
      .min(2, { message: "이름은 최소 2자 이상이어야 합니다." })
      .max(50, { message: "이름은 최대 50자까지 입력 가능합니다." }),
    phoneNumber: z.string().regex(/^010-\d{4}-\d{4}$/, {
      message: "휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)",
    }),
    gender: z.string().min(1, { message: "성별을 선택하세요." }),
    company: z
      .string()
      .min(2, { message: "회사명은 최소 2자 이상이어야 합니다." })
      .max(100, { message: "회사명은 최대 100자까지 입력 가능합니다." }),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) return false;
      return true;
    },
    { path: ["currentPassword"], message: "현재 비밀번호를 입력하세요." },
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.newPasswordConfirm)
        return false;
      return true;
    },
    { path: ["newPasswordConfirm"], message: "비밀번호가 일치하지 않습니다." },
  );

type MyInfoFormData = z.infer<typeof myInfoSchema>;

export function MyInfoForm() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const memberId = currentUser?.id ?? "";

  const { data, isLoading, isError, refetch } = useMyInfo(memberId);
  const { mutateAsync: updateMyInfo, isPending } = useUpdateMyInfo();

  const [changedImageId, setChangedImageId] = useState<number | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<MyInfoFormData>({
    resolver: zodResolver(myInfoSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      name: "",
      phoneNumber: "",
      gender: "",
      company: "",
    },
  });

  // API 응답으로 폼 초기값 세팅
  useEffect(() => {
    if (data?.data) {
      const member = data.data;
      reset({
        email: member.email,
        name: member.name,
        phoneNumber: formatPhoneForDisplay(member.phoneNumber),
        gender: member.gender,
        company: member.company,
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      });
      if (member.memberImage) {
        setProfileImageUrl(member.memberImage);
      }
    }
  }, [data, reset]);

  const newPassword = watch("newPassword");
  const isPasswordLengthValid = checkPasswordLength(newPassword || "");
  const isPasswordComplexityValid = checkPasswordComplexity(newPassword || "");

  const handleImageChange = (
    imageId: number | null,
    imageUrl: string | null,
  ) => {
    setChangedImageId(imageId);
    setProfileImageUrl(imageUrl);
  };

  const onSubmit = async (formData: MyInfoFormData) => {
    const requestData: UpdateMemberRequest = {
      name: formData.name,
      phoneNumber: formatPhoneForApi(formData.phoneNumber),
      gender: formData.gender,
      company: formData.company,
    };

    if (formData.newPassword) {
      requestData.pwd = formData.newPassword;
      requestData.currentPwd = formData.currentPassword;
    }

    if (changedImageId !== null) {
      requestData.imageId = changedImageId;
    }

    try {
      await updateMyInfo({ memberId, data: requestData });
      alert("정보가 수정되었습니다.");
    } catch {
      alert("정보 수정에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">정보를 불러오는데 실패했습니다.</p>
        <Button variant="outline" onClick={() => refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* 상단 헤더 영역 */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-safe-top pt-3 pb-3 border-b">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">내 정보 수정</h1>
          <div className="w-9" />
        </div>
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

          {/* 이메일 - disabled */}
          <FloatingLabelInput
            label="이메일"
            type="email"
            value={watch("email") || ""}
            onChange={() => {}}
            disabled
            required
          />

          {/* 현재 비밀번호 */}
          <FloatingLabelInput
            label="현재 비밀번호"
            type="password"
            value={watch("currentPassword") || ""}
            onChange={(value) =>
              setValue("currentPassword", value, { shouldValidate: true })
            }
            placeholder="현재 비밀번호를 입력하세요"
            hasError={!!errors.currentPassword}
            errorMessage={errors.currentPassword?.message}
            disabled={isPending}
          />

          {/* 새 비밀번호 */}
          <div className="space-y-2">
            <FloatingLabelInput
              label="새 비밀번호"
              type="password"
              value={watch("newPassword") || ""}
              onChange={(value) =>
                setValue("newPassword", value, { shouldValidate: true })
              }
              placeholder="8~20자, 영문+숫자+특수문자 포함"
              hasError={!!errors.newPassword}
              errorMessage={errors.newPassword?.message}
              disabled={isPending}
            />
            {/* 새 비밀번호 체크표시 UI - 입력 시에만 표시 */}
            {(watch("newPassword") || "").length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Check
                    className={cn(
                      "h-4 w-4",
                      isPasswordLengthValid ? "text-teal-500" : "text-gray-400",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm",
                      isPasswordLengthValid ? "text-teal-500" : "text-gray-400",
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
            )}
          </div>

          {/* 새 비밀번호 확인 */}
          <FloatingLabelInput
            label="새 비밀번호 확인"
            type="password"
            value={watch("newPasswordConfirm") || ""}
            onChange={(value) =>
              setValue("newPasswordConfirm", value, { shouldValidate: true })
            }
            hasError={!!errors.newPasswordConfirm}
            errorMessage={errors.newPasswordConfirm?.message}
            disabled={isPending}
          />

          {/* 이름 */}
          <FloatingLabelInput
            label="이름"
            value={watch("name") || ""}
            onChange={(value) =>
              setValue("name", value, { shouldValidate: true })
            }
            hasError={!!errors.name}
            errorMessage={errors.name?.message}
            disabled={isPending}
            required
          />

          {/* 전화번호 */}
          <FloatingLabelInput
            label="전화번호"
            type="tel"
            value={watch("phoneNumber") || ""}
            onChange={(value) =>
              setValue("phoneNumber", value, { shouldValidate: true })
            }
            placeholder="010-1234-5678"
            hasError={!!errors.phoneNumber}
            errorMessage={errors.phoneNumber?.message}
            disabled={isPending}
            required
          />

          {/* 성별 */}
          <GenderToggle
            value={watch("gender") || ""}
            onChange={(value) =>
              setValue("gender", value, { shouldValidate: true })
            }
            hasError={!!errors.gender}
            errorMessage={errors.gender?.message}
          />

          {/* 회사명 */}
          <FloatingLabelInput
            label="회사명"
            value={watch("company") || ""}
            onChange={(value) =>
              setValue("company", value, { shouldValidate: true })
            }
            hasError={!!errors.company}
            errorMessage={errors.company?.message}
            disabled={isPending}
            required
          />
        </form>
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="p-4 space-y-2">
        <Button
          type="submit"
          className="w-full py-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold"
          disabled={isPending}
          onClick={handleSubmit(onSubmit)}
        >
          {isPending ? "처리 중..." : "정보 수정하기"}
        </Button>
        <button
          type="button"
          onClick={logout}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
