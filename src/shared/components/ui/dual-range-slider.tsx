/**
 * 듀얼 범위 슬라이더 컴포넌트
 * 두 개의 native input[type=range]로 min/max 범위 선택
 */
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  onMinChange: (val: number) => void;
  onMaxChange: (val: number) => void;
  unit?: string;
  className?: string;
}

export function DualRangeSlider({
  min,
  max,
  step = 1,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  unit = "",
  className,
}: DualRangeSliderProps) {
  const rangeRef = useRef<HTMLDivElement>(null);
  const [minOnTop, setMinOnTop] = useState(false);

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = rangeRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const distToMin = Math.abs(clickPercent - minPercent);
    const distToMax = Math.abs(clickPercent - maxPercent);
    setMinOnTop(distToMin <= distToMax);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val < maxValue) onMinChange(val);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val > minValue) onMaxChange(val);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* 슬라이더 트랙 */}
      <div ref={rangeRef} className="relative h-2 mx-2" onPointerDown={handlePointerDown}>
        {/* 배경 트랙 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-full" />

        {/* 선택된 범위 (rose-500) */}
        <div
          className="absolute top-0 h-2 bg-rose-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min 슬라이더 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
          style={{ zIndex: minOnTop ? 5 : 3 }}
        />

        {/* Max 슬라이더 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
          style={{ zIndex: minOnTop ? 3 : 5 }}
        />

        {/* Min 핸들 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-rose-500 rounded-full shadow-md pointer-events-none transition-transform"
          style={{ left: `calc(${minPercent}% - 10px)` }}
        />

        {/* Max 핸들 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-rose-500 rounded-full shadow-md pointer-events-none transition-transform"
          style={{ left: `calc(${maxPercent}% - 10px)` }}
        />
      </div>

      {/* 최소/최대 레이블 */}
      <div className="flex justify-between mt-3 px-1">
        <span className="text-xs text-gray-400">{min}{unit}</span>
        <span className="text-xs text-gray-400">{max}{unit}</span>
      </div>
    </div>
  );
}
