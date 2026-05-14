/**
 * 혼인 여부 토글 칩 컴포넌트
 */
import { Heart, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaritalStatusToggleProps {
  value: string;
  onChange: (status: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

const options = [
  {
    value: "초혼",
    label: "초혼",
    icon: Heart,
    activeColor: "bg-rose-500 text-white border-rose-500",
    hoverColor: "hover:border-rose-300 hover:bg-rose-50",
  },
  {
    value: "재혼",
    label: "재혼",
    icon: RefreshCw,
    activeColor: "bg-violet-500 text-white border-violet-500",
    hoverColor: "hover:border-violet-300 hover:bg-violet-50",
  },
] as const;

export function MaritalStatusToggle({
  value,
  onChange,
  hasError,
  errorMessage,
  disabled,
}: MaritalStatusToggleProps) {
  return (
    <div className="space-y-1">
      <div
        className={cn(
          "relative px-4 pt-6 pb-3 bg-[#fcfdfe] border border-[#f7f8fa] rounded-xl transition-all duration-200",
          hasError && "ring-2 ring-red-500/50 bg-red-50/30",
        )}
      >
        <span className="absolute left-4 top-2 text-xs text-gray-500 pointer-events-none">
          혼인 여부
          <span className="text-red-500 ml-0.5">*</span>
        </span>

        <div className="flex gap-3 pt-1">
          {options.map(option => {
            const Icon = option.icon;
            const isSelected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => !disabled && onChange(option.value)}
                disabled={disabled}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-all duration-200 font-medium text-sm",
                  disabled && "cursor-default opacity-70 pointer-events-none",
                  isSelected
                    ? option.activeColor
                    : cn(
                        "bg-[#fcfdfe] text-gray-500 border-[#f7f8fa]",
                        !disabled && option.hoverColor,
                      ),
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {hasError && errorMessage && (
        <p className="text-sm text-red-500 px-1">{errorMessage}</p>
      )}
    </div>
  );
}
