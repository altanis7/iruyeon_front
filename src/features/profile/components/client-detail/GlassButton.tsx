import { cn } from "@/lib/utils";

interface GlassButtonProps {
  variant?: "default" | "danger";
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
        "backdrop-blur-md border rounded-full transition-all duration-200",
        "flex items-center justify-center",
        "active:scale-95",
        // variant 스타일
        variant === "default" && [
          "bg-white/15 text-white border-white/20",
          "hover:bg-white/25",
        ],
        variant === "danger" && [
          "bg-red-500/80 text-white border-red-400/30",
          "hover:bg-red-500/90",
        ],
        // size 스타일 - 높이 통일 (40px = h-10)
        size === "icon" && "w-10 h-10",
        size === "sm" && "h-10 px-3 gap-1 text-xs font-medium",
        size === "md" && "h-10 px-5 text-sm font-medium",
        className
      )}
    >
      {children}
    </button>
  );
}
