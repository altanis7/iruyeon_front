/**
 * 나이 범위 입력 컴포넌트 (최소~최대)
 */
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { YearSelectDialog } from "./YearSelectDialog";
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn("space-y-3", className)}>
      {/* 최소 나이 */}
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">최소 나이</div>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-start", !minAge && "text-muted-foreground")}
          onClick={() => setMinDialogOpen(true)}
        >
          {minAge
            ? `${minAge}년생 (만 ${currentYear - minAge}세 이상)`
            : "최소 나이 선택"}
        </Button>
      </div>

      {/* 최대 나이 */}
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">최대 나이</div>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-start", !maxAge && "text-muted-foreground")}
          onClick={() => setMaxDialogOpen(true)}
        >
          {maxAge
            ? `${maxAge}년생 (만 ${currentYear - maxAge}세 이하)`
            : "최대 나이 선택"}
        </Button>
      </div>

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
