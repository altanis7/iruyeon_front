import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SPLASH_DURATION = 1600;
const FADE_OUT_DURATION = 400;

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), SPLASH_DURATION);
    const completeTimer = setTimeout(
      onComplete,
      SPLASH_DURATION + FADE_OUT_DURATION,
    );
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center",
        "transition-opacity duration-400 ease-out",
        isFading ? "opacity-0" : "opacity-100",
      )}
      style={{ backgroundColor: "#78193d" }}
    >
      <img
        src="/iruyeonSplash.png"
        alt="이루연"
        width={210}
        height={80}
        className="animate-[splash-logo_600ms_ease-out_both]"
      />
    </div>
  );
}
