/**
 * Floating Label Input 컴포넌트
 * 라벨이 인풋 안에 위치하며, 값이 있거나 포커스 시 위로 올라가는 스타일
 */
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  type?: "text" | "tel" | "email" | "number";
  maxLength?: number;
  className?: string;
}

export function FloatingLabelInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  hasError = false,
  errorMessage,
  type = "text",
  maxLength,
  className,
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFloating ? placeholder : ""}
          maxLength={maxLength}
          className={cn(
            "w-full px-4 pt-6 pb-2 bg-[#fcfdfe] border border-[#f7f8fa] rounded-xl text-base transition-all duration-200 outline-none",
            "focus:bg-white focus:ring-2 focus:ring-primary/20",
            hasError && "ring-2 ring-red-500/50 bg-red-50/30"
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
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      </div>
      {hasError && errorMessage && (
        <p className="text-sm text-red-500 px-1">{errorMessage}</p>
      )}
    </div>
  );
}
