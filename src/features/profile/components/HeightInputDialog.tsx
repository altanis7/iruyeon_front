/**
 * 키 입력 바텀시트 (숫자 입력)
 */
import { useState, useEffect } from "react";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetFooter,
} from "@/shared/components/ui/bottom-sheet";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface HeightInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  value?: number;
  onConfirm: (height: number) => void;
}

export function HeightInputDialog({
  open,
  onOpenChange,
  title = "키 입력",
  value,
  onConfirm,
}: HeightInputDialogProps) {
  const [height, setHeight] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || height.length > 0;

  useEffect(() => {
    if (open && value !== undefined) {
      setHeight(String(value));
    } else if (!open) {
      setHeight("");
    }
  }, [open, value]);

  const handleConfirm = () => {
    const heightNum = parseInt(height, 10);
    if (!isNaN(heightNum) && heightNum > 0) {
      onConfirm(heightNum);
      onOpenChange(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>{title}</BottomSheetTitle>
        </BottomSheetHeader>

        <div className="py-4">
          <div className="relative">
            <input
              type="number"
              value={height}
              onChange={e => setHeight(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFloating ? "숫자를 입력하세요" : ""}
              autoFocus
              className={cn(
                "w-full px-4 pt-6 pb-2 pr-12 bg-[#fcfdfe] border border-[#f7f8fa] rounded-xl text-base transition-all duration-200 outline-none",
                "focus:bg-white focus:ring-2 focus:ring-primary/20",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
            />
            <label
              className={cn(
                "absolute left-4 transition-all duration-200 pointer-events-none",
                isFloating
                  ? "top-2 text-xs text-gray-500"
                  : "top-1/2 -translate-y-1/2 text-base text-gray-400"
              )}
            >
              키
            </label>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              cm
            </span>
          </div>
        </div>

        <BottomSheetFooter className="flex flex-col gap-2 pt-2">
          <Button
            onClick={handleConfirm}
            disabled={!height || parseInt(height, 10) <= 0}
            className="w-full h-12 rounded-full text-base font-semibold bg-pink-500 hover:bg-pink-600 text-white"
          >
            확인
          </Button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full h-10 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            취소
          </button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}
