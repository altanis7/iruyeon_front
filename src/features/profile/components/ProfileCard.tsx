import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";
import type { ClientDisplayData } from "../api/profileApi";
import {
  formatValue,
  formatHeight,
  formatNameWithBirthYear,
} from "../utils/clientFormat";

interface ProfileCardProps {
  profile: ClientDisplayData;
  onClick?: () => void;
  className?: string;
}

/**
 * 프로필 카드 컴포넌트
 * - 매니저 정보 (상단)
 * - 회원 프로필 사진 (중앙, 크게)
 * - 회원 정보 5줄 (하단, 중앙 정렬)
 */
export function ProfileCard({ profile, onClick, className }: ProfileCardProps) {
  const displayName = formatNameWithBirthYear(profile.name, profile.birthYear);
  const displayHeight = formatHeight(profile.height);
  const displayUniversity = formatValue(profile.university);
  const displayJob = formatValue(profile.job);
  const displayAddress = formatValue(profile.address);

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
        {/* 1. 매니저 정보 */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={profile.memberImage} alt={profile.memberName} />
            <AvatarFallback className="text-xs">
              {profile.memberName[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-600">{profile.memberName}</span>
        </div>

        {/* 2. 회원 프로필 사진 */}
        <div className="flex justify-center mb-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={profile.image} alt={profile.name} />
            <AvatarFallback className="text-2xl">
              {profile.name ? profile.name[0] : "?"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* 3. 회원 정보 */}
        <div className="space-y-1.5 text-center">
          <div className="text-sm font-medium text-gray-900">
            {displayName}
          </div>
          <div className="text-xs text-gray-700">{displayHeight}</div>
          <div
            className="text-xs text-gray-700 line-clamp-1"
            title={displayUniversity}
          >
            {displayUniversity}
          </div>
          <div className="text-xs text-gray-700 line-clamp-1" title={displayJob}>
            {displayJob}
          </div>
          <div
            className="text-xs text-gray-700 line-clamp-1"
            title={displayAddress}
          >
            {displayAddress}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
