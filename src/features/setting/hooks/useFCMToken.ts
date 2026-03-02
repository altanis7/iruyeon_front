import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMessagingInstance } from "@/lib/firebase";
import { fcmApi } from "../api/fcmApi";

export const useFCMToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(
    Notification.permission
  );

  // 토큰 등록 mutation
  const { mutate: registerToken } = useMutation({
    mutationFn: fcmApi.registerToken,
    onSuccess: () => {
      console.log("FCM token registered successfully");
    },
    onError: (error) => {
      console.error("Failed to register FCM token:", error);
    },
  });

  // 권한 요청 함수
  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        await generateToken();
      } else {
        toast.error("알림 권한이 거부되었습니다.");
      }
    } catch (error) {
      console.error("Permission request failed:", error);
      toast.error("알림 권한 요청 중 오류가 발생했습니다.");
    }
  };

  // 토큰 생성 함수
  const generateToken = async () => {
    const messaging = getMessagingInstance();
    if (!messaging) {
      console.warn("Messaging not available (SSR or unsupported browser)");
      return;
    }

    try {
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
      });

      if (currentToken) {
        setToken(currentToken);
        registerToken(currentToken);
      } else {
        console.warn("No registration token available.");
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  };

  // Foreground 메시지 수신
  useEffect(() => {
    const messaging = getMessagingInstance();
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      const title = payload.notification?.title || "새 알림";
      const body = payload.notification?.body || "";

      // Sonner toast로 표시
      toast(title, {
        description: body,
        duration: 5000,
      });
    });

    return () => unsubscribe();
  }, []);

  return {
    token,
    permission,
    requestPermission,
    hasPermission: permission === "granted",
  };
};
