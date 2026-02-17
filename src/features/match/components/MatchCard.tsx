import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReceivedMatch, MemberClientDTO } from "../api/matchApi";
import { matchStatusConfig } from "../utils/matchFormat";
import { ChatModal } from "./ChatModal";

interface MatchCardProps {
  match: ReceivedMatch;
  className?: string;
}

/** 클라이언트 프로필 카드 (이미지 배경 + 텍스트 오버레이) */
function ClientProfileCard({ data }: { data: MemberClientDTO }) {
  return (
    <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden">
      {/* 배경 이미지 */}
      <img
        src={data.clientImage ?? "/placeholder-avatar.png"}
        alt={data.clientName}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* 매니저 뱃지 (이미지 위 왼쪽 상단) */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
        <Avatar className="h-4 w-4">
          <AvatarImage src={data.memberImage ?? undefined} />
          <AvatarFallback className="text-[8px] bg-gray-600 text-white">
            {data.memberName?.[0]}
          </AvatarFallback>
        </Avatar>
        <span className="text-[11px] text-white font-medium">
          {data.memberName}
        </span>
      </div>

      {/* 텍스트 오버레이 (하단) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <div className="font-bold text-lg">{data.clientName}</div>
        <div className="text-sm opacity-90">{data.clientJob}</div>
        <div className="text-xs opacity-80">{data.clientSchool}</div>
      </div>
    </div>
  );
}

/**
 * 매칭 카드 컴포넌트
 * - 큰 이미지 배경 + 텍스트 오버레이 스타일
 * - 중앙 하트 아이콘
 * - 매칭 상태에 따라 하단 버튼 분기
 */
export function MatchCard({ match, className }: MatchCardProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const {
    memberClientResponseDTO,
    oppositeMemberClientDTO,
    matchStatus,
    newChatCnt,
    matchId,
  } = match;
  const statusConfig = matchStatusConfig[matchStatus];

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* 상단: 상태 헤더 (카드 전체 너비) */}
      <div
        className={cn(
          "px-4 py-2.5",
          statusConfig.headerBg,
        )}
      >
        <span className={cn("font-semibold text-sm", statusConfig.headerText)}>
          {statusConfig.label}
        </span>
      </div>

      <CardContent className="p-4">
        {/* 프로필 이미지 영역 */}
        <div className="relative flex gap-2 items-center">
          {/* 우리측 클라이언트 */}
          <ClientProfileCard data={memberClientResponseDTO} />

          {/* 중앙 하트 아이콘 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            </div>
          </div>

          {/* 상대측 클라이언트 */}
          <ClientProfileCard data={oppositeMemberClientDTO} />
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-2 mt-4">
          {matchStatus === "PENDING" ? (
            <>
              {/* 매칭 수락 */}
              <Button
                variant="default"
                className="flex-1 h-11 bg-rose-500 hover:bg-rose-600"
              >
                매칭 수락
              </Button>
              {/* 거절 */}
              <Button variant="outline" className="flex-1 h-11">
                거절
              </Button>
              {/* 채팅 아이콘 */}
              <Button
                variant="outline"
                className="relative h-11 px-4"
                onClick={() => setChatOpen(true)}
              >
                <MessageCircle className="h-5 w-5" />
                {newChatCnt > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {newChatCnt}
                  </span>
                )}
              </Button>
            </>
          ) : (
            /* 채팅 보기 버튼 (전체 너비) */
            <Button
              variant="outline"
              className="flex-1 h-11 relative"
              onClick={() => setChatOpen(true)}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              채팅 보기
              {newChatCnt > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {newChatCnt}
                </span>
              )}
            </Button>
          )}
        </div>
      </CardContent>

      {/* 채팅 모달 */}
      <ChatModal matchId={matchId} open={chatOpen} onOpenChange={setChatOpen} />
    </Card>
  );
}
