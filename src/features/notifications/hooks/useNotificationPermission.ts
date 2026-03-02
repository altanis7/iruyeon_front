import { useState, useEffect } from "react";

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  useEffect(() => {
    // 권한 상태가 변경될 수 있으므로 주기적으로 체크
    const checkPermission = () => {
      if (typeof Notification !== "undefined") {
        setPermission(Notification.permission);
      }
    };

    checkPermission();

    // visibilitychange 이벤트로 탭 전환 시 권한 상태 재확인
    document.addEventListener("visibilitychange", checkPermission);

    return () => {
      document.removeEventListener("visibilitychange", checkPermission);
    };
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (typeof Notification === "undefined") {
      console.warn("Notifications not supported");
      return "denied";
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error("Permission request failed:", error);
      return "denied";
    }
  };

  // iOS Safari PWA 체크
  const isIOSPWA = (): boolean => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = "standalone" in window.navigator &&
                        (window.navigator as any).standalone === true;
    return isIOS && isStandalone;
  };

  // 알림 지원 여부
  const isSupported = typeof Notification !== "undefined";

  return {
    permission,
    requestPermission,
    isSupported,
    isIOSPWA: isIOSPWA(),
    hasPermission: permission === "granted",
    isDenied: permission === "denied",
    isDefault: permission === "default",
  };
};
