/**
 * 성별 토글 칩 컴포넌트
 * 아이콘 + 텍스트 형태의 토글 버튼 (플로팅 라벨 포함)
 */
import { cn } from "@/lib/utils";

interface GenderToggleProps {
  value: string;
  onChange: (gender: string) => void;
  hasError?: boolean;
  errorMessage?: string;
}

export function GenderToggle({ value, onChange, hasError, errorMessage }: GenderToggleProps) {
  const hasValue = value && value.length > 0;

  const options = [
    {
      value: "남자",
      label: "남자",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <circle cx="10" cy="14" r="5" />
          <path d="M19 5l-5.4 5.4" />
          <path d="M15 5h4v4" />
        </svg>
      ),
      activeColor: "bg-blue-500 text-white border-blue-500",
      hoverColor: "hover:border-blue-300 hover:bg-blue-50",
    },
    {
      value: "여자",
      label: "여자",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M12 13v8" />
          <path d="M9 18h6" />
        </svg>
      ),
      activeColor: "bg-pink-500 text-white border-pink-500",
      hoverColor: "hover:border-pink-300 hover:bg-pink-50",
    },
  ];

  return (
    <div className="space-y-1">
      {/* 컨테이너 - 다른 인풋과 동일한 스타일 */}
      <div
        className={cn(
          "relative px-4 pt-6 pb-3 bg-[#fcfdfe] border border-[#f7f8fa] rounded-xl transition-all duration-200",
          hasError && "ring-2 ring-red-500/50 bg-red-50/30"
        )}
      >
        {/* 플로팅 라벨 */}
        <span
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            hasValue
              ? "top-2 text-xs text-gray-500"
              : "top-2 text-xs text-gray-500"
          )}
        >
          성별
          <span className="text-red-500 ml-0.5">*</span>
        </span>

        {/* 토글 버튼들 */}
        <div className="flex gap-3 pt-1">
          {options.map((option) => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-all duration-200 font-medium text-sm",
                  isSelected
                    ? option.activeColor
                    : cn(
                        "bg-[#fcfdfe] text-gray-500 border-[#f7f8fa]",
                        option.hoverColor
                      )
                )}
              >
                {option.icon}
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
