import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { getToken, deleteToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { getMessagingInstance } from "@/lib/firebase";
import { notificationApi } from "../api/notificationApi";

export const usePushToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 토큰 등록 mutation
  const { mutate: registerToken } = useMutation({
    mutationFn: (fcmToken: string) =>
      notificationApi.registerPushToken({
        token: fcmToken,
        deviceType: "web",
      }),
    onSuccess: () => {
      console.log("Push token registered successfully");
    },
    onError: (error) => {
      console.error("Failed to register push token:", error);
      toast.error("푸시 토큰 등록에 실패했습니다.");
    },
  });

  // 토큰 해제 mutation
  const { mutate: unregisterToken } = useMutation({
    mutationFn: notificationApi.unregisterPushToken,
    onSuccess: () => {
      console.log("Push token unregistered successfully");
      setToken(null);
    },
    onError: (error) => {
      console.error("Failed to unregister push token:", error);
    },
  });

  // FCM 토큰 생성
  const generateToken = async (): Promise<string | null> => {
    const messaging = getMessagingInstance();
    if (!messaging) {
      console.warn("Messaging not available");
      return null;
    }

    setIsGenerating(true);

    try {
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
      });

      if (currentToken) {
        setToken(currentToken);
        registerToken(currentToken);
        return currentToken;
      } else {
        console.warn("No FCM token available");
        return null;
      }
    } catch (error) {
      console.error("Error generating FCM token:", error);
      toast.error("푸시 토큰 생성에 실패했습니다.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // FCM 토큰 삭제
  const removeToken = async (): Promise<void> => {
    const messaging = getMessagingInstance();
    if (!messaging || !token) return;

    try {
      await deleteToken(messaging);
      unregisterToken(token);
    } catch (error) {
      console.error("Error deleting FCM token:", error);
    }
  };

  // 토큰 갱신 감지
  useEffect(() => {
    const messaging = getMessagingInstance();
    if (!messaging) return;

    // 토큰이 갱신되면 자동으로 재등록
    const unsubscribe = onMessage(messaging, () => {
      // 메시지 수신 시 토큰이 갱신되었을 수 있으므로 재생성
      if (token) {
        generateToken();
      }
    });

    return () => unsubscribe();
  }, [token]);

  return {
    token,
    isGenerating,
    generateToken,
    removeToken,
    hasToken: !!token,
  };
};
