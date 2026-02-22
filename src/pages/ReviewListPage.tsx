import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, MessageCircle, Loader2, Pin } from "lucide-react";
import { useReviews } from "@/features/review/hooks/useReviews";
import { ChatModal } from "@/features/match/components/ChatModal";
import type { ReviewListItem } from "@/features/review/api/reviewApi";
import { cn } from "@/lib/utils";

/** 포스트잇 색상 팔레트 */
const POST_IT_COLORS = [
  "bg-yellow-100 border-yellow-200",
  "bg-pink-100 border-pink-200",
  "bg-green-100 border-green-200",
  "bg-blue-100 border-blue-200",
  "bg-purple-100 border-purple-200",
  "bg-orange-100 border-orange-200",
];

/** 포스트잇 회전 각도 */
const ROTATIONS = [
  "-rotate-1",
  "rotate-1",
  "-rotate-2",
  "rotate-2",
  "rotate-0",
];

/** 포스트잇 스타일 후기 카드 */
function PostItCard({
  review,
  index,
  onChatClick,
}: {
  review: ReviewListItem;
  index: number;
  onChatClick: () => void;
}) {
  const colorClass = POST_IT_COLORS[index % POST_IT_COLORS.length];
  const rotationClass = ROTATIONS[index % ROTATIONS.length];

  return (
    <div
      className={cn(
        "relative p-5 rounded-sm border-2 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]",
        colorClass,
        rotationClass
      )}
    >
      {/* 핀 장식 */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 drop-shadow-md">
        <Pin className="h-7 w-7 text-red-500 fill-red-400 rotate-45" />
      </div>

      {/* 상단: 날짜 */}
      <div className="text-right mb-3 pt-2">
        <span className="text-xs text-gray-500 font-medium">
          {new Date(review.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* 후기 내용 */}
      <p className="text-sm text-gray-800 whitespace-pre-wrap mb-4 min-h-[60px] leading-relaxed">
        {review.content}
      </p>

      {/* 구분선 */}
      <div className="border-t border-dashed border-gray-300 my-3" />

      {/* 하단: 작성자 정보 + 채팅 버튼 */}
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold text-sm text-gray-700">
            {review.clientName}
          </div>
          <div className="text-xs text-gray-500">
            by {review.memberName}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-white/50"
          onClick={onChatClick}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ReviewListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = Number(searchParams.get("clientId"));

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useReviews(clientId);

  const [chatOpen, setChatOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // 무한 스크롤 IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleChatClick = (matchId: number) => {
    setSelectedMatchId(matchId);
    setChatOpen(true);
  };

  // 모든 페이지의 후기 평탄화
  const reviews = data?.pages.flatMap((page) => page.data.list) ?? [];

  // clientId 검증
  if (!clientId) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-amber-50 max-w-md mx-auto">
        <p className="text-gray-500">클라이언트 정보가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="h-dvh w-full overflow-y-auto bg-amber-50 max-w-md mx-auto scrollbar-hide shadow-[0_0_20px_#0000000d]">
      {/* 헤더 - 코르크보드 느낌 */}
      <div className="sticky top-0 z-10 bg-amber-100 border-b-2 border-amber-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-amber-200"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-amber-900">📌 만남 후기</h1>
      </div>

      {/* 콘텐츠 - 코르크보드 배경 */}
      <div
        className="p-5 space-y-6"
        style={{
          backgroundImage: `radial-gradient(circle, #d4a574 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      >
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        )}

        {/* 에러 상태 */}
        {isError && (
          <div className="flex flex-col items-center py-12 gap-4">
            <p className="text-gray-600">후기를 불러오는데 실패했습니다 😢</p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="bg-white hover:bg-amber-50"
            >
              다시 시도
            </Button>
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading && !isError && reviews.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 text-center">
              아직 받은 후기가 없습니다<br />
              <span className="text-sm text-gray-400">첫 후기를 기다려보세요!</span>
            </p>
          </div>
        )}

        {/* 포스트잇 후기 목록 */}
        {reviews.map((review, index) => (
          <PostItCard
            key={review.reviewId}
            review={review}
            index={index}
            onChatClick={() => handleChatClick(review.matchId)}
          />
        ))}

        {/* 무한 스크롤 트리거 */}
        <div ref={observerRef} className="h-4" />

        {/* 추가 로딩 스피너 */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
          </div>
        )}
      </div>

      {/* 채팅 모달 */}
      {selectedMatchId && (
        <ChatModal
          matchId={selectedMatchId}
          open={chatOpen}
          onOpenChange={setChatOpen}
        />
      )}
    </div>
  );
}
