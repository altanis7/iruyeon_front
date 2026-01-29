import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";
import type { Profile, ClientDisplayData } from "../api/profileApi";
import {
  formatValue,
  formatHeight,
  formatNameWithBirthYear,
} from "../utils/clientFormat";

type ProfileCardData = Profile | ClientDisplayData;

interface ProfileCardProps {
  profile: ProfileCardData;
  onClick?: () => void;
  className?: string;
}

/**
 * 타입 가드: ClientDisplayData 체크
 */
function isClientDisplayData(data: ProfileCardData): data is ClientDisplayData {
  return "memberName" in data;
}

/**
 * 프로필 카드 컴포넌트
 * - 매니저 정보 (상단)
 * - 회원 프로필 사진 (중앙, 크게)
 * - 회원 정보 5줄 (하단, 중앙 정렬)
 */
export function ProfileCard({ profile, onClick, className }: ProfileCardProps) {
  // 타입에 따라 다른 필드 사용
  const mainPhoto = isClientDisplayData(profile)
    ? profile.image
    : undefined;

  const name = isClientDisplayData(profile)
    ? profile.name
    : profile.name || "프로필";

  // ClientDisplayData 전용 데이터
  const memberName = isClientDisplayData(profile) ? profile.memberName : "";
  const memberImage = isClientDisplayData(profile) ? profile.memberImage : "";
  const height = isClientDisplayData(profile) ? profile.height : 0;
  const university = isClientDisplayData(profile) ? profile.university : "";
  const address = isClientDisplayData(profile) ? profile.address : "";

  // 포맷된 값
  const displayName = formatNameWithBirthYear(name, profile.birthYear);
  const displayHeight = formatHeight(height);
  const displayUniversity = formatValue(university);
  const displayJob = formatValue(profile.job);
  const displayAddress = formatValue(address);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
        "min-h-[320px]",
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* 1. 매니저 정보 (ClientDisplayData만) */}
        {isClientDisplayData(profile) && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={memberImage} alt={memberName} />
              <AvatarFallback className="text-xs">
                {memberName[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">{memberName}</span>
          </div>
        )}

        {/* 2. 회원 프로필 사진 */}
        <div className="flex justify-center mb-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={mainPhoto} alt={name} />
            <AvatarFallback className="text-2xl">
              {name ? name[0] : "?"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* 3. 회원 정보 */}
        <div className="space-y-1.5 text-center">
          {/* 이름(년생) */}
          <div className="text-sm font-medium text-gray-900">
            {displayName}
          </div>

          {/* ClientDisplayData만 키 정보 표시 */}
          {isClientDisplayData(profile) && (
            <div className="text-xs text-gray-700">{displayHeight}</div>
          )}

          {/* 대학교 */}
          <div
            className="text-xs text-gray-700 line-clamp-1"
            title={displayUniversity}
          >
            {displayUniversity}
          </div>

          {/* 직업 */}
          <div className="text-xs text-gray-700 line-clamp-1" title={displayJob}>
            {displayJob}
          </div>

          {/* ClientDisplayData만 주소 표시 */}
          {isClientDisplayData(profile) && (
            <div
              className="text-xs text-gray-700 line-clamp-1"
              title={displayAddress}
            >
              {displayAddress}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
