import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useMyInfo } from "@/features/member/hooks/useMyInfo";
import { formatPhoneForDisplay } from "@/features/member/api/memberApi";
import { FloatingLabelInput } from "@/features/profile/components/FloatingLabelInput";
import { GenderToggle } from "@/features/profile/components/GenderToggle";

interface ManagerInfoViewProps {
  memberId: string;
}

export function ManagerInfoView({ memberId }: ManagerInfoViewProps) {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useMyInfo(memberId);

  const member = data?.data;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white z-10 px-4 pt-3 pb-3 border-b">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">매니저 정보</h1>
            <div className="w-9" />
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <p className="text-slate-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="flex flex-col h-full">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white z-10 px-4 pt-3 pb-3 border-b">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">매니저 정보</h1>
            <div className="w-9" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-4 px-4">
          <p className="text-slate-500 text-center">
            정보를 불러오는데 실패했습니다.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 - ProfileEditPage와 동일한 스타일 */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-3 pb-3 border-b">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">매니저 정보</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* 스크롤 가능한 컨텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/* 아바타 + 이름 영역 */}
        <div className="flex flex-col items-center pt-8 pb-6">
          <Avatar className="h-24 w-24 ring-4 ring-slate-100 shadow-lg">
            <AvatarImage
              src={member?.memberImage ?? undefined}
              alt={member?.name}
            />
            <AvatarFallback className="text-2xl bg-pink-100 text-pink-600">
              {member?.name?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            {member?.name}
          </h1>
        </div>

        {/* 정보 인풋들 - ProfileEditPage와 동일한 디자인 */}
        <div className="px-4 pb-6 space-y-4">
          <FloatingLabelInput
            label="전화번호"
            value={
              member?.phoneNumber
                ? formatPhoneForDisplay(member.phoneNumber)
                : ""
            }
            onChange={() => {}} // readOnly처럼 동작
            disabled
          />

          <GenderToggle
            value={member?.gender ?? ""}
            onChange={() => {}} // readOnly처럼 동작
            disabled
          />

          <FloatingLabelInput
            label="회사명"
            value={member?.company ?? ""}
            onChange={() => {}} // readOnly처럼 동작
            disabled
          />
        </div>
      </div>
    </div>
  );
}
