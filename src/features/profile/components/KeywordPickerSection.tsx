/**
 * 키워드 선택 섹션 (성격/이상형)
 * 빈 상태 + 바텀시트 선택 + 선택된 칩 표시
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/shared/components/ui/bottom-sheet";
import { Button } from "@/shared/components/ui/button";

interface KeywordPickerSectionProps {
  label: string;
  keywords: readonly string[];
  selectedKeywords: string[];
  onSelectionChange: (selected: string[]) => void;
  maxSelection?: number;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
  emptySubText?: string;
}

// 기본 빈 상태 아이콘 (하트/스타)
function DefaultEmptyIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className="text-gray-300"
    >
      <path
        d="M24 42l-2.1-1.9C10.5 30.1 4 24.3 4 17c0-5.5 4.5-10 10-10 3.2 0 6.2 1.5 8 3.8C23.8 8.5 26.8 7 30 7c5.5 0 10 4.5 10 10 0 7.3-6.5 13.1-17.9 23.1L24 42z"
        fill="currentColor"
      />
    </svg>
  );
}

export function KeywordPickerSection({
  label,
  keywords,
  selectedKeywords,
  onSelectionChange,
  maxSelection = 3,
  emptyIcon,
  emptyText = "아직 선택된 항목이 없습니다.",
  emptySubText = "버튼을 눌러 선택해주세요.",
}: KeywordPickerSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  const hasSelection = selectedKeywords.length > 0;

  const handleOpen = () => {
    setTempSelected([...selectedKeywords]);
    setIsOpen(true);
  };

  const handleToggleKeyword = (keyword: string) => {
    if (tempSelected.includes(keyword)) {
      setTempSelected(tempSelected.filter(k => k !== keyword));
    } else {
      if (tempSelected.length >= maxSelection) return;
      setTempSelected([...tempSelected, keyword]);
    }
  };

  const handleConfirm = () => {
    onSelectionChange(tempSelected);
    setIsOpen(false);
  };

  const handleRemoveKeyword = (keyword: string) => {
    onSelectionChange(selectedKeywords.filter(k => k !== keyword));
  };

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-gray-900">
          {label}{" "}
          <span className="text-gray-400 font-normal">
            (최대 {maxSelection}개)
          </span>
        </span>
        <button
          type="button"
          onClick={handleOpen}
          className="text-primary font-medium text-sm hover:text-primary/80 transition-colors"
        >
          + 선택하기
        </button>
      </div>

      {/* 빈 상태 또는 선택된 키워드 */}
      {!hasSelection ? (
        <div className="flex flex-col items-center justify-center py-10 bg-[#fcfdfe] border-2 border-dashed border-[#f7f8fa] rounded-xl">
          {emptyIcon || <DefaultEmptyIcon />}
          <p className="mt-4 text-gray-400 text-sm">{emptyText}</p>
          <p className="text-gray-400 text-sm">{emptySubText}</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 p-4 bg-[#fcfdfe] border border-[#f7f8fa] rounded-xl min-h-[60px]">
          {selectedKeywords.map(keyword => (
            <span
              key={keyword}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {keyword}
              <button
                type="button"
                onClick={() => handleRemoveKeyword(keyword)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 선택 바텀시트 */}
      <BottomSheet open={isOpen} onOpenChange={setIsOpen}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle className="text-lg font-semibold">
              {label} 선택
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({tempSelected.length}/{maxSelection})
              </span>
            </BottomSheetTitle>
          </BottomSheetHeader>

          <div className="py-4">
            <div className="grid grid-cols-2 gap-2">
              {keywords.map(keyword => {
                const isSelected = tempSelected.includes(keyword);
                const isDisabled = !isSelected && tempSelected.length >= maxSelection;

                return (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => handleToggleKeyword(keyword)}
                    disabled={isDisabled}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-2",
                      isSelected
                        ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-pink-400 hover:text-pink-500",
                      isDisabled && "opacity-40 cursor-not-allowed hover:border-gray-200 hover:text-gray-600"
                    )}
                  >
                    {keyword}
                  </button>
                );
              })}
            </div>

            {tempSelected.length >= maxSelection && (
              <p className="mt-3 text-xs text-amber-600 text-center">
                최대 {maxSelection}개까지 선택할 수 있습니다.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="button"
              onClick={handleConfirm}
              className="w-full h-12 rounded-full text-base font-semibold bg-pink-500 hover:bg-pink-600 text-white"
            >
              선택 완료
            </Button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full h-10 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              취소
            </button>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
}
