import { useState, useCallback, useEffect } from "react";

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getKey(userId: string): string {
  return `privacy_disclaimer_shown_${userId}`;
}

export function usePrivacyDisclaimer(enabled: boolean, userId: string) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!enabled || !userId) {
      setIsOpen(false);
      return;
    }
    if (localStorage.getItem(getKey(userId)) !== getTodayStr()) {
      setIsOpen(true);
    }
  }, [enabled, userId]);

  const confirm = useCallback(() => {
    localStorage.setItem(getKey(userId), getTodayStr());
    setIsOpen(false);
  }, [userId]);

  return { isOpen, confirm };
}
