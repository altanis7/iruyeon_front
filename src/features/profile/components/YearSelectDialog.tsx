import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { calculateAge } from "../api/profileApi";
import { cn } from "@/lib/utils";

interface YearSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  selectedYear?: number;
  onConfirm: (year: number) => void;
  minAge?: number; // 최소 나이 (기본값: 20세)
  maxAge?: number; // 최대 나이 (기본값: 50세)
}

export function YearSelectDialog({
  open,
  onOpenChange,
  title,
  selectedYear,
  onConfirm,
  minAge = 20,
  maxAge = 50,
}: YearSelectDialogProps) {
  const currentYear = new Date().getFullYear();
  const minBirthYear = currentYear - maxAge; // 가장 오래된 년도
  const maxBirthYear = currentYear - minAge; // 가장 최근 년도

  // 년도 목록 생성 (최신 년도부터)
  const years: number[] = [];
  for (let year = maxBirthYear; year >= minBirthYear; year--) {
    years.push(year);
  }

  // 기본 시작 년도를 중간값으로 설정
  const defaultYear =
    selectedYear || Math.floor((maxBirthYear + minBirthYear) / 2);

  const [tempSelectedYear, setTempSelectedYear] = useState<number>(defaultYear);

  // 확인 버튼 핸들러
  const handleConfirm = () => {
    onConfirm(tempSelectedYear);
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
            {tempSelectedYear}년생 ({calculateAge(tempSelectedYear)}세)
          </p>
        </DialogHeader>

        {/* 년도 버튼 그리드 */}
        <div className="grid grid-cols-4 gap-2 py-4 max-h-96 overflow-y-auto">
          {years.map((year) => {
            const isSelected = year === tempSelectedYear;
            return (
              <Button
                key={year}
                type="button"
                variant={isSelected ? "default" : "outline"}
                onClick={() => setTempSelectedYear(year)}
                className={cn(
                  "h-10 text-sm transition-all",
                  isSelected
                    ? "bg-gray-700 hover:bg-gray-800 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300",
                )}
              >
                {year}
              </Button>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleConfirm}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white"
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
