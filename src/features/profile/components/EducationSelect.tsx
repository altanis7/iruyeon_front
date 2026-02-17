/**
 * 학력 선택 컴포넌트 (기획서 기준)
 * - 학력 수준 선택 (고졸/학사/석사/박사/전문대)
 */
import { useState } from "react";
import { ProfilePickerDialog } from "./ProfilePickerDialog";
import { EDUCATION_LEVELS } from "../constants/profileOptions";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface EducationSelectProps {
  value: string; // eduLevel
  onChange: (level: string) => void;
  required?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
}

export function EducationSelect({
  value,
  onChange,
  required = false,
  hasError = false,
  errorMessage,
  className,
}: EducationSelectProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasValue = value && value.length > 0;

  const handleConfirm = (level: string) => {
    onChange(level);
  };

  return (
    <div className={cn("space-y-1", className)}>
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className={cn(
          "w-full px-4 pt-6 pb-2 bg-[#fcfdfe] border border-[#f7f8fa] rounded-xl text-base transition-all duration-200 outline-none text-left relative",
          "focus:bg-white focus:ring-2 focus:ring-primary/20",
          "hover:bg-white",
          hasError && "ring-2 ring-red-500/50 bg-red-50/30"
        )}
      >
        <span
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            hasValue
              ? "top-2 text-xs text-gray-500"
              : "top-1/2 -translate-y-1/2 text-base text-gray-400"
          )}
        >
          학력
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
        <span className={cn(
          "block pt-1",
          hasValue ? "text-gray-900" : "text-transparent"
        )}>
          {value || "선택하세요"}
        </span>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </button>
      {hasError && errorMessage && (
        <p className="text-sm text-red-500 px-1">{errorMessage}</p>
      )}

      <ProfilePickerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="학력 선택"
        options={[...EDUCATION_LEVELS]}
        selectedValue={value || ""}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
