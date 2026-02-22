import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { Ruler, GraduationCap, Briefcase, MapPin, Heart } from "lucide-react";
import type { ClientDisplayData } from "../api/profileApi";
import { formatValue, formatHeight } from "../utils/clientFormat";

interface ProfileCardProps {
  profile: ClientDisplayData;
  onClick?: () => void;
  onMatchRequest?: () => void;
  isMyClient?: boolean;
  className?: string;
}

/**
 * 프로필 카드 컴포넌트
 * - 상단: 그라데이션 배경 + 담당 매니저 뱃지 + 프로필 사진
 * - 중앙: 이름 + 출생년도 + 상태 뱃지
 * - 하단: 2열 그리드 정보 + 매칭 신청 버튼
 */
export function ProfileCard({
  profile,
  onClick,
  onMatchRequest,
  isMyClient = false,
  className,
}: ProfileCardProps) {
  const displayHeight = formatHeight(profile.height);
  const displayUniversity = formatValue(profile.university);
  const displayJob = formatValue(profile.job);
  const displayAddress = formatValue(profile.address);
  const isActive = profile.status === "ACTIVE";

  const handleMatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMatchRequest?.();
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] overflow-hidden isolate",
        className,
      )}
      onClick={onClick}
    >
      {/* 상단 영역: 프로필 사진 (카드 전체 너비) */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {/* 프로필 사진 (전체 채우기) */}
        {profile.image ? (
          <img
            src={profile.image}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-4xl text-gray-400">
              {profile.name ? profile.name[0] : "?"}
            </span>
          </div>
        )}

        {/* 상단 그라데이션 (매니저 뱃지 가독성) */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/20 to-transparent" />

        {/* 하단 그라데이션 (이름 가독성) */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />

        {/* 이름 + 출생년도 + 상태 뱃지 (이미지 하단) */}
        <div className="absolute inset-x-0 bottom-2 z-10 flex items-center justify-between px-3">
          <div className="flex items-baseline gap-1 text-white drop-shadow-md">
            <span className="font-bold text-base">{profile.name}</span>
            <span className="text-xs font-normal">({profile.birthYear}년생)</span>
          </div>
          <span
            className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0",
              isActive
                ? "bg-pink-500 text-white"
                : "bg-gray-500 text-white",
            )}
          >
            {isActive ? "활동" : "비활동"}
          </span>
        </div>

        {/* 담당 매니저 뱃지 (좌상단) */}
        <div className="absolute top-2 left-2 z-10">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={profile.memberImage ?? undefined}
                alt={profile.memberName}
              />
              <AvatarFallback className="text-[10px] bg-pink-100 text-pink-600">
                {profile.memberName?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-gray-600 font-medium">
              {profile.memberName} 매니저
            </span>
          </div>
        </div>
      </div>

      <CardContent className="px-2.5 py-2.5">
        {/* 2열 정보 그리드 */}
        <div className="grid grid-cols-2 gap-x-1.5 gap-y-1.5 mb-2.5">
          {/* 키 */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-0.5 text-gray-400">
              <Ruler className="h-2.5 w-2.5 shrink-0" />
              <span className="text-[9px] uppercase">Height</span>
            </div>
            <span className="text-[11px] text-gray-700 font-medium truncate">
              {displayHeight}
            </span>
          </div>

          {/* 대학 */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-0.5 text-gray-400">
              <GraduationCap className="h-2.5 w-2.5 shrink-0" />
              <span className="text-[9px] uppercase">University</span>
            </div>
            <span
              className="text-[11px] text-gray-700 font-medium truncate"
              title={displayUniversity}
            >
              {displayUniversity}
            </span>
          </div>

          {/* 직업 */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-0.5 text-gray-400">
              <Briefcase className="h-2.5 w-2.5 shrink-0" />
              <span className="text-[9px] uppercase">Job</span>
            </div>
            <span
              className="text-[11px] text-gray-700 font-medium truncate"
              title={displayJob}
            >
              {displayJob}
            </span>
          </div>

          {/* 주소 */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-0.5 text-gray-400">
              <MapPin className="h-2.5 w-2.5 shrink-0" />
              <span className="text-[9px] uppercase">Location</span>
            </div>
            <span
              className="text-[11px] text-gray-700 font-medium truncate"
              title={displayAddress}
            >
              {displayAddress}
            </span>
          </div>
        </div>

        {/* 버튼: 내 회원이면 프로필 보기, 아니면 매칭 신청하기 */}
        {isMyClient ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-full text-xs h-9"
            onClick={onClick}
          >
            프로필 보기
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-full text-xs h-9"
            onClick={handleMatchClick}
          >
            <Heart className="h-3.5 w-3.5 mr-1.5 fill-current" />
            매칭 신청하기
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
