/**
 * Floating Label Select 컴포넌트
 * 라벨이 내부에 위치하는 선택형 버튼 (Input 디자인과 동일)
 */
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FloatingLabelSelectProps {
  label: string;
  value: string | number | undefined;
  displayValue?: string;
  onClick: () => void;
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
}

export function FloatingLabelSelect({
  label,
  value,
  displayValue,
  onClick,
  placeholder = "선택하세요",
  required = false,
  hasError = false,
  errorMessage,
  className,
}: FloatingLabelSelectProps) {
  const hasValue = value !== undefined && value !== "" && value !== null;
  const display = displayValue || (hasValue ? String(value) : "");

  return (
    <div className={cn("space-y-1", className)}>
      <button
        type="button"
        onClick={onClick}
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
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
        <span className={cn(
          "block pt-1",
          hasValue ? "text-gray-900" : "text-transparent"
        )}>
          {display || placeholder}
        </span>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </button>
      {hasError && errorMessage && (
        <p className="text-sm text-red-500 px-1">{errorMessage}</p>
      )}
    </div>
  );
}
