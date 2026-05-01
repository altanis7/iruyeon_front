import { Heart, Users, X } from "lucide-react";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/shared/components/ui/bottom-sheet";
import type { ClientStatus } from "@/features/profile/api/profileApi";

type InactiveStatus = Extract<
  ClientStatus,
  "INACTIVE_MARRIED" | "INACTIVE_DATING" | "INACTIVE"
>;

interface InactiveStatusSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (status: InactiveStatus) => void;
}

const OPTIONS: {
  status: InactiveStatus;
  label: string;
  description: string;
}[] = [
  {
    status: "INACTIVE_MARRIED",
    label: "성혼 완료",
    description: "매칭을 통해 결혼에 성공했습니다",
  },
  {
    status: "INACTIVE_DATING",
    label: "교제중",
    description: "현재 교제 중인 상대가 있습니다",
  },
  {
    status: "INACTIVE",
    label: "해당 없음",
    description: "기타 사유로 비활동 처리합니다",
  },
];

export function InactiveStatusSheet({
  open,
  onOpenChange,
  onSelect,
}: InactiveStatusSheetProps) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent className="px-6 pb-8">
        <BottomSheetHeader className="pb-4">
          <BottomSheetTitle className="text-center text-lg font-bold text-gray-900">
            비활동 사유 선택
          </BottomSheetTitle>
          <p className="text-center text-sm text-gray-500 mt-1">
            비활동으로 전환하는 사유를 선택해주세요
          </p>
        </BottomSheetHeader>

        <div className="flex flex-col gap-3 mt-2">
          {OPTIONS.map(option => (
            <button
              key={option.status}
              onClick={() => onSelect(option.status)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                {option.status === "INACTIVE_MARRIED" ? (
                  <Heart className="w-5 h-5 text-red-400" />
                ) : option.status === "INACTIVE_DATING" ? (
                  <Users className="w-5 h-5 text-red-400" />
                ) : (
                  <X className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {option.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {option.description}
                </p>
              </div>
            </button>
          ))}

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full h-10 text-sm text-gray-500 hover:text-gray-700 transition-colors mt-1"
          >
            취소
          </button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}
