import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetFooter,
} from "@/shared/components/ui/bottom-sheet";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "default" | "destructive";
}

/**
 * 확인 바텀시트 컴포넌트
 * - 사용자 액션에 대한 확인을 받는 재사용 가능한 바텀시트
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  isLoading = false,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent className="px-6">
        <BottomSheetHeader className="pb-4">
          <BottomSheetTitle className="text-center text-lg font-bold text-gray-900">
            {title}
          </BottomSheetTitle>
          <BottomSheetDescription className="text-center text-sm text-gray-500 mt-1">
            {description}
          </BottomSheetDescription>
        </BottomSheetHeader>
        <BottomSheetFooter className="flex flex-col gap-2 pt-2">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "w-full h-12 rounded-full text-base font-semibold",
              variant === "destructive"
                ? "bg-destructive hover:bg-destructive/90 text-white"
                : "bg-pink-500 hover:bg-pink-600 text-white"
            )}
          >
            {isLoading ? "처리 중..." : confirmText}
          </Button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full h-10 text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}
