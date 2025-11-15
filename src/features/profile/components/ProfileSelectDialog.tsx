import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  options: string[];
  selectedValues: string[];
  onConfirm: (values: string[]) => void;
  multiSelect?: boolean; // 다중 선택 가능 여부 (기본값: true)
  maxSelection?: number; // 최대 선택 가능 개수 (multiSelect=true일 때만 유효)
}

export function ProfileSelectDialog({
  open,
  onOpenChange,
  title,
  options,
  selectedValues,
  onConfirm,
  multiSelect = true,
  maxSelection,
}: ProfileSelectDialogProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedValues);

  // 다이얼로그가 열릴 때 현재 선택된 값으로 초기화
  useEffect(() => {
    if (open) {
      setTempSelected(selectedValues);
    }
  }, [open, selectedValues]);

  // 체크박스 토글
  const handleToggle = (value: string) => {
    if (multiSelect) {
      // 멀티 선택: 체크박스 토글
      if (tempSelected.includes(value)) {
        // 이미 선택된 경우 제거
        setTempSelected(tempSelected.filter((v) => v !== value));
      } else {
        // 선택되지 않은 경우 추가 (최대 개수 확인)
        if (maxSelection && tempSelected.length >= maxSelection) {
          alert(`최대 ${maxSelection}개까지 선택 가능합니다.`);
          return;
        }
        setTempSelected([...tempSelected, value]);
      }
    } else {
      // 싱글 선택: 외형은 체크박스, 동작은 라디오
      if (tempSelected.includes(value)) {
        // 동일한 항목 재클릭 시 선택 유지 (최소 1개 필수)
        return;
      } else {
        // 새로운 항목 선택 시 기존 선택 해제하고 새로운 항목만 선택
        setTempSelected([value]);
      }
    }
  };

  // 초기화
  const handleReset = () => {
    setTempSelected([]);
  };

  // 확인
  const handleConfirm = () => {
    if (!multiSelect && tempSelected.length === 0) {
      alert("항목을 선택해주세요.");
      return;
    }
    onConfirm(tempSelected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-red-500">
            {title}
          </DialogTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            선택지에 결혼에 필요한 이성의 프로필이 등록되면 알림을 받으실 수 있습니다!
            {maxSelection && (
              <span className="block text-red-500 mt-1">
                (※ 최대 {maxSelection}개 지역 선택 가능)
              </span>
            )}
          </p>
        </DialogHeader>

        {/* 옵션 리스트 - 칩 스타일 버튼 (크기 고정) */}
        <div className="grid grid-cols-2 gap-3 py-4 max-h-96 overflow-y-auto">
          {options.map((option) => {
            const isSelected = tempSelected.includes(option);
            return (
              <Button
                key={option}
                type="button"
                variant={isSelected ? "default" : "outline"}
                onClick={() => handleToggle(option)}
                className={cn(
                  "h-11 text-sm font-medium transition-all whitespace-nowrap px-4",
                  isSelected
                    ? "bg-gray-700 hover:bg-gray-800 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300",
                )}
              >
                {option}
              </Button>
            );
          })}
        </div>

        <DialogFooter className={multiSelect ? "grid grid-cols-2 gap-2" : ""}>
          {multiSelect && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-black"
            >
              초기화
            </Button>
          )}
          <Button
            type="button"
            onClick={handleConfirm}
            className={`${multiSelect ? "" : "w-full"} bg-gray-700 hover:bg-gray-800 text-white`}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
