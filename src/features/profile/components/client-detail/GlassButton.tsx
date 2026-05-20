import { cn } from "@/lib/utils";

interface GlassButtonProps {
  variant?: "default" | "danger" | "inactive";
  size?: "icon" | "sm" | "md";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function GlassButton({
  variant = "default",
  size = "md",
  children,
  onClick,
  className,
}: GlassButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        // 공통 스타일
        "relative isolate overflow-hidden backdrop-blur-md border rounded-full transition-all duration-200",
        "flex items-center justify-center text-white",
        "ring-1 ring-black/10 shadow-[0_8px_24px_rgba(15,23,42,0.24),inset_0_1px_0_rgba(255,255,255,0.34)]",
        "[text-shadow:0_1px_3px_rgba(0,0,0,0.55)] [&_svg]:drop-shadow-md",
        "active:scale-95",
        // variant 스타일
        variant === "default" && [
          "bg-black/20 border-white/35",
          "hover:bg-black/25 hover:border-white/45",
        ],
        variant === "danger" && [
          "bg-red-500/75 border-red-100/40 ring-red-950/20",
          "hover:bg-red-500/85 hover:border-red-50/50",
        ],
        variant === "inactive" && [
          "bg-red-500/75 border-red-100/40 ring-red-950/20",
          "hover:bg-red-500/85 hover:border-red-50/50",
        ],
        // size 스타일 - 높이 통일 (40px = h-10)
        size === "icon" && "w-10 h-10",
        size === "sm" && "h-10 px-3 gap-1 text-xs font-medium",
        size === "md" && "h-10 px-5 text-sm font-medium",
        className,
      )}
    >
      {children}
    </button>
  );
}
