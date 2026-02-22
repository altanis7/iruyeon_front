/**
 * 재산 입력 컴포넌트 (금액 + 단위)
 */
import { useState, useEffect } from "react";
import { PROPERTY_UNITS } from "../constants/profileOptions";
import { cn } from "@/lib/utils";

interface PropertyInputProps {
  value?: string; // "5억", "3천만원" 형태
  onChange: (value: string) => void;
  className?: string;
}

export function PropertyInput({ value, onChange, className }: PropertyInputProps) {
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<(typeof PROPERTY_UNITS)[number]>("억");
  const [isFocused, setIsFocused] = useState(false);

  // value prop으로부터 금액과 단위 파싱
  useEffect(() => {
    if (value) {
      if (value.includes("억")) {
        const parsed = value.replace("억", "");
        setAmount(parsed);
        setUnit("억");
      } else if (value.includes("천만원")) {
        const parsed = value.replace("천만원", "");
        setAmount(parsed);
        setUnit("천만원");
      }
    }
  }, [value]);

  const hasValue = amount.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative">
        <input
          type="number"
          value={amount}
          onChange={e => {
            const newAmount = e.target.value;
            setAmount(newAmount);
            onChange(newAmount ? `${newAmount}${unit}` : "");
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFloating ? "금액 입력" : ""}
          className={cn(
            "w-full px-4 pt-6 pb-2 pr-28 bg-[#fcfdfe] border border-[#f7f8fa] rounded-xl text-base transition-all duration-200 outline-none",
            "focus:bg-white focus:ring-2 focus:ring-primary/20"
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
          재산
        </label>

        {/* 단위 선택 (인풋 내부 오른쪽) */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {PROPERTY_UNITS.map(u => (
            <button
              key={u}
              type="button"
              onClick={() => {
                setUnit(u);
                onChange(amount ? `${amount}${u}` : "");
              }}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                unit === u
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
