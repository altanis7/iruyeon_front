import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";
import type { MyClientDisplayData } from "../api/profileApi";
import {
  formatValue,
  formatHeight,
  formatNameWithBirthYear,
} from "../utils/clientFormat";

interface MyClientCardProps {
  client: MyClientDisplayData;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  ACTIVE: {
    label: "활동",
    className: "bg-blue-100 text-blue-700",
  },
  INACTIVE: {
    label: "비활동",
    className: "bg-red-100 text-red-700",
  },
} as const;

/**
 * 내 회원 카드 컴포넌트
 * - 회원 프로필 사진 (중앙, 크게)
 * - 회원 정보 5줄 (하단, 중앙 정렬)
 * - 활동/비활동 상태 배지 (맨 하단)
 */
export function MyClientCard({ client, onClick, className }: MyClientCardProps) {
  const displayName = formatNameWithBirthYear(client.name, client.birthYear);
  const displayHeight = formatHeight(client.height);
  const displayUniversity = formatValue(client.university);
  const displayJob = formatValue(client.job);
  const displayAddress = formatValue(client.address);

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
        {/* 1. 회원 프로필 사진 */}
        <div className="flex justify-center mb-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={client.image || undefined} alt={client.name} />
            <AvatarFallback className="text-2xl">
              {client.name ? client.name[0] : "?"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* 2. 회원 정보 */}
        <div className="space-y-1.5 text-center">
          {/* 이름 */}
          <div className="text-sm font-medium text-gray-900">
            {client.name}
          </div>

          {/* 직업 */}
          <div className="text-xs text-gray-700 line-clamp-1" title={displayJob}>
            {displayJob}
          </div>

          {/* 대학교 */}
          <div
            className="text-xs text-gray-700 line-clamp-1"
            title={displayUniversity}
          >
            {displayUniversity}
          </div>

          {/* 주소 */}
          <div
            className="text-xs text-gray-700 line-clamp-1"
            title={displayAddress}
          >
            {displayAddress}
          </div>
        </div>

        {/* 3. 상태 배지 */}
        <div className="mt-3 text-center">
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-full text-xs font-medium",
              statusConfig[client.status].className,
            )}
          >
            {statusConfig[client.status].label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
