import { useState } from "react";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetFooter,
} from "@/shared/components/ui/bottom-sheet";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import type { ReceivedMatch, MemberClientDTO } from "@/features/match/api/matchApi";
import { useCreateReview } from "../hooks/useCreateReview";

interface WriteReviewModalProps {
  match: ReceivedMatch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** 프로필 선택 카드 (이미지 배경 + 텍스트 오버레이 스타일 - MatchCard와 동일) */
function SelectableProfileCard({
  data,
  selected,
  onClick,
}: {
  data: MemberClientDTO;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden transition-all",
        selected
          ? "ring-4 ring-rose-500 ring-offset-2"
          : "hover:opacity-90"
      )}
    >
      {/* 배경 이미지 */}
      <img
        src={data.clientImage ?? "/placeholder-avatar.png"}
        alt={data.clientName}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* 선택 표시 체크마크 */}
      {selected && (
        <div className="absolute top-2 right-2 bg-rose-500 rounded-full p-1">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

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
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-left">
        <div className="font-bold text-lg">{data.clientName}</div>
        <div className="text-sm opacity-90">{data.clientJob}</div>
        <div className="text-xs opacity-80">{data.clientSchool}</div>
      </div>
    </button>
  );
}

export function WriteReviewModal({
  match,
  open,
  onOpenChange,
}: WriteReviewModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedClient, setSelectedClient] = useState<MemberClientDTO | null>(null);
  const [content, setContent] = useState("");
  const createReview = useCreateReview();

  const { memberClientResponseDTO, oppositeMemberClientDTO, matchId } = match;

  const handleClose = () => {
    onOpenChange(false);
    // 모달 닫힐 때 상태 초기화
    setTimeout(() => {
      setStep(1);
      setSelectedClient(null);
      setContent("");
    }, 300);
  };

  const handleNext = () => {
    if (selectedClient) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    if (!selectedClient || !content.trim()) return;

    createReview.mutate(
      {
        clientId: selectedClient.clientId,
        content: content.trim(),
        matchId,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <BottomSheet open={open} onOpenChange={handleClose}>
      <BottomSheetContent>
        {step === 1 ? (
          <>
            <BottomSheetHeader>
              <BottomSheetTitle>후기 대상 선택</BottomSheetTitle>
            </BottomSheetHeader>

            <div className="py-6">
              <p className="text-sm text-gray-500 text-center mb-6">
                후기를 작성할 회원을 선택해주세요
              </p>

              <div className="flex gap-3">
                <SelectableProfileCard
                  data={memberClientResponseDTO}
                  selected={selectedClient?.clientId === memberClientResponseDTO.clientId}
                  onClick={() => setSelectedClient(memberClientResponseDTO)}
                />
                <SelectableProfileCard
                  data={oppositeMemberClientDTO}
                  selected={selectedClient?.clientId === oppositeMemberClientDTO.clientId}
                  onClick={() => setSelectedClient(oppositeMemberClientDTO)}
                />
              </div>
            </div>

            <BottomSheetFooter>
              <Button
                className="w-full h-12 bg-rose-500 hover:bg-rose-600"
                disabled={!selectedClient}
                onClick={handleNext}
              >
                후기 작성하기
              </Button>
            </BottomSheetFooter>
          </>
        ) : (
          <>
            <BottomSheetHeader className="flex-row items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <BottomSheetTitle>만남 후기 작성</BottomSheetTitle>
            </BottomSheetHeader>

            <div className="py-6">
              {/* 선택된 회원 정보 */}
              {selectedClient && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selectedClient.clientImage ?? undefined} />
                    <AvatarFallback className="text-xl bg-gray-200">
                      {selectedClient.clientName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg">
                      {selectedClient.clientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedClient.clientJob}
                    </div>
                  </div>
                </div>
              )}

              {/* 후기 입력 */}
              <Textarea
                placeholder="만남 후기를 작성해주세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px] resize-none"
              />
            </div>

            <BottomSheetFooter>
              <Button
                className="w-full h-12 bg-rose-500 hover:bg-rose-600"
                disabled={!content.trim() || createReview.isPending}
                onClick={handleSubmit}
              >
                {createReview.isPending ? "등록 중..." : "후기 등록"}
              </Button>
            </BottomSheetFooter>
          </>
        )}
      </BottomSheetContent>
    </BottomSheet>
  );
}
