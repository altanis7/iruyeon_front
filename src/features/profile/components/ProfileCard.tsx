import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";
import type { Profile, ClientDisplayData } from "../api/profileApi";
import { calculateAge } from "../api/profileApi";

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
 * - 확장 가능한 구조로 설계
 * - 프로필 사진, 직업, 나이, 학력 표시
 */
export function ProfileCard({ profile, onClick, className }: ProfileCardProps) {
  // 타입에 따라 다른 필드 사용
  const mainPhoto = isClientDisplayData(profile)
    ? profile.image
    : profile.photos?.[profile.mainPhotoIndex] || profile.photos?.[0];

  const name = isClientDisplayData(profile)
    ? profile.name
    : profile.name || "프로필";

  const education = isClientDisplayData(profile)
    ? profile.university
    : profile.education;

  const age = calculateAge(profile.birthYear);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* 프로필 사진 */}
        <div className="flex justify-center mb-3">
          <Avatar className="h-20 w-20">
            <AvatarImage src={mainPhoto} alt={name} />
            <AvatarFallback>{name ? name[0] : "?"}</AvatarFallback>
          </Avatar>
        </div>

        {/* 프로필 정보 */}
        <div className="space-y-1 text-center">
          <div className="text-sm font-medium text-gray-900">{profile.job}</div>
          <div className="text-xs text-gray-600">
            {age}세 · {education}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
