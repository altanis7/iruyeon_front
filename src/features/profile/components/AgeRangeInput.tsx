/**
 * 나이 범위 입력 컴포넌트 (최소~최대)
 */
import { useState } from "react";
import { YearSelectDialog } from "./YearSelectDialog";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AgeRangeInputProps {
  minAge?: number; // 출생년도
  maxAge?: number; // 출생년도
  onMinChange: (year: number | undefined) => void;
  onMaxChange: (year: number | undefined) => void;
  className?: string;
}

export function AgeRangeInput({
  minAge,
  maxAge,
  onMinChange,
  onMaxChange,
  className,
}: AgeRangeInputProps) {
  const [minDialogOpen, setMinDialogOpen] = useState(false);
  const [maxDialogOpen, setMaxDialogOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const hasMinValue = minAge !== undefined;
  const hasMaxValue = maxAge !== undefined;

  return (
    <div className={cn("space-y-3", className)}>
      {/* 최소 나이 */}
      <button
        type="button"
        onClick={() => setMinDialogOpen(true)}
        className={cn(
          "w-full px-4 pt-6 pb-2 bg-[#fcfdfe] border border-[#f7f8fa] rounded-xl text-base transition-all duration-200 outline-none text-left relative",
          "focus:bg-white focus:ring-2 focus:ring-primary/20",
          "hover:bg-white"
        )}
      >
        <span
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            hasMinValue
              ? "top-2 text-xs text-gray-500"
              : "top-1/2 -translate-y-1/2 text-base text-gray-400"
          )}
        >
          최소 나이
        </span>
        <span className={cn(
          "block pt-1",
          hasMinValue ? "text-gray-900" : "text-transparent"
        )}>
          {minAge ? `${minAge}년생 (만 ${currentYear - minAge}세 이상)` : "선택하세요"}
        </span>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </button>

      {/* 최대 나이 */}
      <button
        type="button"
        onClick={() => setMaxDialogOpen(true)}
        className={cn(
          "w-full px-4 pt-6 pb-2 bg-[#fcfdfe] border border-[#f7f8fa] rounded-xl text-base transition-all duration-200 outline-none text-left relative",
          "focus:bg-white focus:ring-2 focus:ring-primary/20",
          "hover:bg-white"
        )}
      >
        <span
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            hasMaxValue
              ? "top-2 text-xs text-gray-500"
              : "top-1/2 -translate-y-1/2 text-base text-gray-400"
          )}
        >
          최대 나이
        </span>
        <span className={cn(
          "block pt-1",
          hasMaxValue ? "text-gray-900" : "text-transparent"
        )}>
          {maxAge ? `${maxAge}년생 (만 ${currentYear - maxAge}세 이하)` : "선택하세요"}
        </span>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </button>

      {/* 최소 나이 선택 다이얼로그 */}
      <YearSelectDialog
        open={minDialogOpen}
        onOpenChange={setMinDialogOpen}
        title="최소 나이 선택"
        selectedYear={minAge}
        onConfirm={year => {
          onMinChange(year);
          setMinDialogOpen(false);
        }}
      />

      {/* 최대 나이 선택 다이얼로그 */}
      <YearSelectDialog
        open={maxDialogOpen}
        onOpenChange={setMaxDialogOpen}
        title="최대 나이 선택"
        selectedYear={maxAge}
        onConfirm={year => {
          onMaxChange(year);
          setMaxDialogOpen(false);
        }}
      />
    </div>
  );
}
