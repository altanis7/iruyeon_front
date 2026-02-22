import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Heart, HeartCrack, HeartPulse, Loader2, Sparkles, MessageCircle, X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { WriteReviewModal } from "@/features/review/components/WriteReviewModal";
import type { ReceivedMatch, MemberClientDTO } from "../api/matchApi";
import { matchStatusConfig, type StatusIconAnimation } from "../utils/matchFormat";

/** 상태별 아이콘 맵 (lucide 아이콘만, 커스텀 아이콘은 별도 처리) */
const statusIcons = {
  Heart,
  HeartCrack,
  HeartPulse,
  Loader2,
  Sparkles,
} as const;

/** 애니메이션 클래스 맵 */
const animationClasses: Record<NonNullable<StatusIconAnimation>, string> = {
  spin: "animate-spin",
  pulse: "animate-pulse",
};

/** 하트 날리는 애니메이션 컴포넌트 */
function FloatingHeartsIcon({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-5 w-5", className)}>
      {/* 메인 하트 - 두근두근 (outline만) */}
      <Heart
        className="absolute inset-0 h-5 w-5 animate-[heartbeat_1s_ease-in-out_infinite]"
      />
      {/* 떠오르는 미니 하트들 */}
      <Heart
        className="absolute h-2 w-2 fill-current opacity-80 animate-[float-up_2s_ease-out_infinite]"
        style={{ left: "-2px", bottom: "0" }}
      />
      <Heart
        className="absolute h-1.5 w-1.5 fill-current opacity-60 animate-[float-up_2s_ease-out_infinite_0.5s]"
        style={{ right: "-2px", bottom: "2px" }}
      />
      <Heart
        className="absolute h-2 w-2 fill-current opacity-70 animate-[float-up_2s_ease-out_infinite_1s]"
        style={{ left: "50%", bottom: "-2px", transform: "translateX(-50%)" }}
      />
      {/* 커스텀 애니메이션 스타일 */}
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes float-up {
          0% {
            opacity: 0.8;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-12px) scale(0.5);
          }
        }
      `}</style>
    </div>
  );
}

/** 깨진 하트 커스텀 아이콘 - 검은색 하트에 흰 균열 */
function BrokenHeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 왼쪽 하트 조각 */}
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09L12 5.09V21.35z" />
      {/* 오른쪽 하트 조각 */}
      <path d="M12 21.35V5.09l.5-.91C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      {/* 균열 선 (흰색) */}
      <path
        d="M12 5 L10.5 9 L13 11 L10 15 L12.5 17 L12 21"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
import { ChatModal } from "./ChatModal";
import { useCancelMatch } from "../hooks/useCancelMatch";

interface MatchCardProps {
  match: ReceivedMatch;
  className?: string;
  /** 카드 타입: sent일 때 취소 버튼 노출 */
  variant?: "received" | "sent" | "matched";
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
export function MatchCard({
  match,
  className,
  variant = "received",
}: MatchCardProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const cancelMatch = useCancelMatch();
  const {
    memberClientResponseDTO,
    oppositeMemberClientDTO,
    matchStatus,
    newChatCnt,
    matchId,
  } = match;

  // 취소 가능 여부: 보낸 매칭이고 PENDING 또는 UNREAD 상태
  const canCancel =
    variant === "sent" &&
    (matchStatus === "PENDING" || matchStatus === "UNREAD");

  const handleCancel = () => {
    if (confirm("매칭 신청을 취소하시겠습니까?")) {
      cancelMatch.mutate(matchId);
    }
  };
  const statusConfig = matchStatusConfig[matchStatus] ?? {
    label: matchStatus ?? "알 수 없음",
    headerBg: "bg-gray-100",
    headerText: "text-gray-700",
  };

  return (
    <Card className={cn("overflow-hidden isolate", className)}>
      {/* 상단: 상태 헤더 (카드 전체 너비) */}
      <div className={cn("px-4 py-2.5", statusConfig.headerBg)}>
        <span className={cn("font-semibold text-sm", statusConfig.headerText)}>
          {statusConfig.label}
        </span>
      </div>

      <CardContent className="p-4">
        {/* 프로필 이미지 영역 */}
        <div className="relative flex gap-2 items-center">
          {/* 우리측 클라이언트 */}
          <ClientProfileCard data={memberClientResponseDTO} />

          {/* 중앙 아이콘 - 상태별 차별화 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-white rounded-full p-2 shadow-lg">
              {(() => {
                const iconType = statusConfig.icon ?? "Heart";
                const animation = statusConfig.iconAnimation;

                // 커스텀 컴포넌트들
                if (iconType === "FloatingHearts") {
                  return (
                    <FloatingHeartsIcon
                      className={statusConfig.iconColor ?? "text-purple-500"}
                    />
                  );
                }

                if (iconType === "BrokenHeart") {
                  return (
                    <BrokenHeartIcon
                      className={cn("h-5 w-5", statusConfig.iconColor ?? "text-gray-900")}
                    />
                  );
                }

                const IconComponent = statusIcons[iconType as keyof typeof statusIcons];
                return (
                  <IconComponent
                    className={cn(
                      "h-5 w-5",
                      statusConfig.iconColor ?? "text-rose-500",
                      statusConfig.iconFill && "fill-current",
                      animation && animationClasses[animation]
                    )}
                  />
                );
              })()}
            </div>
          </div>

          {/* 상대측 클라이언트 */}
          <ClientProfileCard data={oppositeMemberClientDTO} />
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-2 mt-4">
          {matchStatus === "PENDING" && variant === "received" ? (
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
          ) : variant === "matched" ? (
            /* Case 2: 매칭 완료 → 채팅 + 후기 작성 */
            <>
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
              <Button
                variant="default"
                className="flex-1 h-11 bg-rose-500 hover:bg-rose-600"
                onClick={() => setReviewOpen(true)}
              >
                <Pencil className="h-5 w-5 mr-2" />
                후기 작성
              </Button>
            </>
          ) : (
            /* Case 3: 보낸 매칭 (sent) → 채팅 + 취소 버튼 */
            <>
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
              {canCancel && (
                <Button
                  variant="outline"
                  className="h-11 px-4 text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-600"
                  onClick={handleCancel}
                  disabled={cancelMatch.isPending}
                >
                  <X className="h-5 w-5 mr-1" />
                  {cancelMatch.isPending ? "취소 중..." : "매칭 취소"}
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>

      {/* 채팅 모달 */}
      <ChatModal matchId={matchId} open={chatOpen} onOpenChange={setChatOpen} />

      {/* 후기 작성 모달 */}
      <WriteReviewModal
        match={match}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
      />
    </Card>
  );
}
