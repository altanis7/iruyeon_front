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
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white",
        "transition-opacity duration-400 ease-out",
        isFading ? "opacity-0" : "opacity-100",
      )}
    >
      <img
        src="/logo512.png"
        alt="이루연"
        className="h-28 w-28 animate-[splash-logo_600ms_ease-out_both]"
      />
    </div>
  );
}
