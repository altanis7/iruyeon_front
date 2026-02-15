import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReceivedMatch, MemberClientDTO } from "../api/matchApi";
import { matchStatusConfig } from "../utils/matchFormat";
import { ChatModal } from "./ChatModal";

interface MatchCardProps {
  match: ReceivedMatch;
  className?: string;
}

/** 한쪽 클라이언트 프로필 (카드 내부용) */
function ClientProfile({
  data,
  ringColor,
}: {
  data: MemberClientDTO;
  ringColor: string;
}) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      {/* 담당 멤버 */}
      <div className="flex items-center gap-1 mb-2">
        <Avatar className="h-5 w-5">
          <AvatarImage src={data.memberImage ?? undefined} alt={data.memberName} />
          <AvatarFallback className="text-[10px]">
            {data.memberName?.[0] || "?"}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-gray-500 truncate max-w-[80px]">
          담당 {data.memberName}
        </span>
      </div>

      {/* 클라이언트 아바타 */}
      <Avatar className={cn("h-20 w-20 ring-4 mb-2", ringColor)}>
        <AvatarImage src={data.clientImage ?? undefined} alt={data.clientName} />
        <AvatarFallback className="text-lg">
          {data.clientName?.[0] || "?"}
        </AvatarFallback>
      </Avatar>

      {/* 클라이언트 정보 */}
      <div className="text-center space-y-0.5">
        <div className="font-semibold text-sm truncate">{data.clientName}</div>
        <div className="text-xs text-gray-600">{data.clientJob}</div>
        <div className="text-xs text-gray-600">{data.clientSchool}</div>
      </div>
    </div>
  );
}

/**
 * 매칭 카드 컴포넌트
 * - 양측 클라이언트를 나란히 표시 (우리측 ← 화살표 → 상대측)
 * - 매칭 상태에 따라 하단 버튼 분기
 * - newChatCnt 기반 채팅 뱃지
 */
export function MatchCard({ match, className }: MatchCardProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const { memberClientResponseDTO, oppositeMemberClientDTO, matchStatus, newChatCnt, matchId } = match;
  const statusConfig = matchStatusConfig[matchStatus];

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-5">
        {/* 매칭 상태 뱃지 */}
        <div className="mb-4">
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              statusConfig.bgColor,
              statusConfig.textColor,
            )}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* 양측 클라이언트 비교 */}
        <div className="flex items-center gap-2">
          {/* 우리측 (좌) */}
          <ClientProfile
            data={memberClientResponseDTO}
            ringColor="ring-blue-300"
          />

          {/* 화살표 */}
          <div className="flex-shrink-0 text-gray-400">
            <ArrowRight className="h-6 w-6" />
          </div>

          {/* 상대측 (우) */}
          <ClientProfile
            data={oppositeMemberClientDTO}
            ringColor="ring-pink-300"
          />
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-2 mt-4">
          {matchStatus === "PENDING" && (
            <>
              <Button variant="outline" className="flex-1" size="sm">
                거절
              </Button>
              <Button variant="outline" className="flex-1" size="sm">
                수락
              </Button>
            </>
          )}
          {matchStatus === "DEACTIVATED_USER" ? (
            <div className="flex-1 text-center text-sm text-gray-400 py-1">
              비활성 회원
            </div>
          ) : matchStatus !== "REJECTED" && matchStatus !== "CANCELED" ? (
            <Button
              variant="default"
              className="flex-1 relative"
              size="sm"
              onClick={() => setChatOpen(true)}
            >
              채팅 보기
              {newChatCnt > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {newChatCnt}
                </span>
              )}
            </Button>
          ) : null}
        </div>
      </CardContent>

      {/* 채팅 모달 */}
      <ChatModal
        matchId={matchId}
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </Card>
  );
}
