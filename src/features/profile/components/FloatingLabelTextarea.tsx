/**
 * Floating Label Textarea 컴포넌트
 * 라벨이 텍스트영역 안에 위치하며, 값이 있거나 포커스 시 위로 올라가는 스타일
 */
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
}

export function FloatingLabelTextarea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  hasError = false,
  errorMessage,
  maxLength,
  rows = 4,
  className,
}: FloatingLabelTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFloating ? placeholder : ""}
          maxLength={maxLength}
          rows={rows}
          className={cn(
            "w-full px-4 pt-6 pb-2 bg-[#fcfdfe] border border-[#f7f8fa] rounded-xl text-base transition-all duration-200 outline-none resize-none",
            "focus:bg-white focus:ring-2 focus:ring-primary/20",
            hasError && "ring-2 ring-red-500/50 bg-red-50/30"
          )}
        />
        <label
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none bg-transparent",
            isFloating
              ? "top-2 text-xs text-gray-500"
              : "top-4 text-base text-gray-400"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {maxLength && (
          <span className="absolute bottom-2 right-3 text-xs text-gray-400">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {hasError && errorMessage && (
        <p className="text-sm text-red-500 px-1">{errorMessage}</p>
      )}
    </div>
  );
}
