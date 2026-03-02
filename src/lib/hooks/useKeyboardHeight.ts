import { useEffect, useState } from "react";

/**
 * 모바일 소프트 키보드 높이를 감지하는 hook
 * iOS Safari에서 visualViewport API를 사용하여 키보드가 바텀시트를 가리는 문제를 해결
 */
export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const onResize = () => {
      const heightDiff = window.innerHeight - viewport.height;
      setKeyboardHeight(heightDiff > 50 ? heightDiff : 0);
    };

    viewport.addEventListener("resize", onResize);
    viewport.addEventListener("scroll", onResize);

    return () => {
      viewport.removeEventListener("resize", onResize);
      viewport.removeEventListener("scroll", onResize);
    };
  }, []);

  return keyboardHeight;
}
