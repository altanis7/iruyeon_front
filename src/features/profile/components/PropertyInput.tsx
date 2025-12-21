/**
 * 재산 입력 컴포넌트 (금액 + 단위)
 */
import { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
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

  return (
    <div className={cn("flex gap-2", className)}>
      {/* 금액 입력 */}
      <Input
        type="number"
        placeholder="금액 입력"
        value={amount}
        onChange={e => {
          const newAmount = e.target.value;
          setAmount(newAmount);
          onChange(newAmount ? `${newAmount}${unit}` : "");
        }}
        className="flex-1"
      />

      {/* 단위 선택 */}
      <div className="flex gap-1">
        {PROPERTY_UNITS.map(u => (
          <Button
            key={u}
            type="button"
            variant={unit === u ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setUnit(u);
              onChange(amount ? `${amount}${u}` : "");
            }}
            className={cn("px-4", unit === u && "bg-primary text-primary-foreground")}
          >
            {u}
          </Button>
        ))}
      </div>
    </div>
  );
}
