import { Card, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReceivedMatch } from "../api/matchApi";
import { formatMatchDate } from "../utils/matchFormat";

interface MatchCardProps {
  match: ReceivedMatch;
  className?: string;
}

/**
 * 매칭 카드 컴포넌트
 * - 담당 매니저 정보
 * - 클라이언트 프로필 (성별에 따라 테두리 색상)
 * - 매칭 메시지
 * - 하단 액션 버튼 (거절, 수락, 채팅 보기)
 */
export function MatchCard({ match, className }: MatchCardProps) {
  const { memberClientResponseDTO, message, openAt } = match;
  const {
    memberName,
    memberImage,
    clientName,
    clientImage,
    age,
    job,
    university,
    address,
    gender,
  } = memberClientResponseDTO;

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-5">
        {/* 담당 매니저 */}
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-6 w-6">
            <AvatarImage src={memberImage} alt={memberName} />
            <AvatarFallback className="text-xs">
              {memberName[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">담당 {memberName}</span>
        </div>

        {/* 클라이언트 프로필 */}
        <div className="flex flex-col items-center">
          {/* 아바타 (성별에 따라 테두리 색상) */}
          <Avatar
            className={cn(
              "h-28 w-28 ring-4 mb-3",
              gender === "남자" ? "ring-blue-300" : "ring-pink-300",
            )}
          >
            <AvatarImage src={clientImage} alt={clientName} />
            <AvatarFallback className="text-2xl">
              {clientName[0] || "?"}
            </AvatarFallback>
          </Avatar>

          {/* 정보 */}
          <div className="text-center space-y-1 w-full">
            <div className="font-semibold text-base">
              {clientName} ({age})
            </div>
            <div className="text-sm text-gray-600">{job}</div>
            <div className="text-sm text-gray-600">{university}</div>
            <div className="text-sm text-gray-600 line-clamp-1" title={address}>
              {address}
            </div>
          </div>
        </div>

        {/* 매칭 메시지 */}
        {message && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
            "{message}"
          </div>
        )}

        {/* 날짜 */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          {formatMatchDate(openAt)}
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" size="sm">
            거절
          </Button>
          <Button variant="outline" className="flex-1" size="sm">
            수락
          </Button>
          <Button variant="default" className="flex-1 relative" size="sm">
            채팅 보기
            {/* 임시 하드코딩 뱃지 */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
