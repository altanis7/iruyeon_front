import { useState } from "react";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/shared/components/ui/bottom-sheet";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useAcceptMatch } from "../hooks/useAcceptMatch";
import { useRejectMatch } from "../hooks/useRejectMatch";
import { useCancelMatch } from "../hooks/useCancelMatch";

interface MatchResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchId: number;
  type: "accept" | "reject" | "cancel";
}

const config = {
  accept: {
    title: "매칭 수락",
    placeholder: "상대 매니저에게 전달할 메시지를 입력하세요.",
    buttonText: "수락하기",
    buttonClass: "bg-pink-400 hover:bg-pink-500 text-white",
  },
  reject: {
    title: "매칭 거절",
    placeholder: "거절 사유를 입력하세요.",
    buttonText: "거절하기",
    buttonClass: "bg-gray-500 hover:bg-gray-600 text-white",
  },
  cancel: {
    title: "매칭 취소",
    description: "매칭 신청을 취소하시겠습니까?",
    buttonText: "취소하기",
    buttonClass: "bg-red-500 hover:bg-red-600 text-white",
  },
} as const;

export function MatchResponseDialog({
  open,
  onOpenChange,
  matchId,
  type,
}: MatchResponseDialogProps) {
  const [message, setMessage] = useState("");

  const acceptMatch = useAcceptMatch();
  const rejectMatch = useRejectMatch();
  const cancelMatch = useCancelMatch();

  const mutationMap = {
    accept: acceptMatch,
    reject: rejectMatch,
    cancel: cancelMatch,
  };
  const mutation = mutationMap[type];

  const { title, buttonText, buttonClass } = config[type];

  const handleSubmit = () => {
    if (type === "cancel") {
      cancelMatch.mutate(matchId, {
        onSuccess: () => {
          setMessage("");
          onOpenChange(false);
        },
      });
    } else {
      (mutation as typeof acceptMatch).mutate(
        { matchId, message: message.trim() },
        {
          onSuccess: () => {
            setMessage("");
            onOpenChange(false);
          },
        },
      );
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setMessage("");
    }
    onOpenChange(open);
  };

  return (
    <BottomSheet open={open} onOpenChange={handleOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle className="text-center text-lg font-semibold pb-4">
            {title}
          </BottomSheetTitle>
        </BottomSheetHeader>

        {type === "cancel" ? (
          <div className="flex flex-col gap-2 pt-2 pb-4">
            <p className="text-sm text-gray-500 text-center mb-2">
              {config.cancel.description}
            </p>
            <Button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="w-full h-12 rounded-full text-base font-semibold bg-destructive hover:bg-destructive/90 text-white"
            >
              {mutation.isPending ? "처리 중..." : "매칭 취소"}
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
              className="w-full h-10 text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              닫기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder={config[type].placeholder}
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                autoFocus
                className="bg-gray-50 border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300"
              />
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className={`w-full h-12 font-semibold rounded-full text-base disabled:bg-gray-300 ${buttonClass}`}
            >
              {mutation.isPending ? "처리 중..." : buttonText}
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
              className="w-full h-10 text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              닫기
            </button>
          </div>
        )}
      </BottomSheetContent>
    </BottomSheet>
  );
}
