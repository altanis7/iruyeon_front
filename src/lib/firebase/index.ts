import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { apiClient } from "@/lib/api/client";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  projectId: import.meta.env.VITE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

let messaging: ReturnType<typeof getMessaging> | null = null;

export const getMessagingInstance = () => {
  if (typeof window === "undefined") return null;
  if (!messaging) {
    messaging = getMessaging(app);
  }
  return messaging;
};

export async function registerFCMTokenOnLogin() {
  try {
    console.log("[FCM] 토큰 등록 시작");

    if (!("Notification" in window)) {
      console.warn("[FCM] Notification API 미지원");
      return;
    }

    const permission = await Notification.requestPermission();
    console.log("[FCM] 알림 권한:", permission);
    if (permission !== "granted") return;

    const messagingInstance = getMessagingInstance();
    if (!messagingInstance) {
      console.warn("[FCM] messaging 인스턴스 생성 실패");
      return;
    }

    const token = await getToken(messagingInstance, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    });
    console.log("[FCM] 토큰 획득:", token ? "성공" : "실패");
    if (!token) return;

    await apiClient.post("/alarm/fcm", { fcmToken: token });
    console.log("[FCM] 토큰 백엔드 전송 완료");
  } catch (error) {
    console.error("[FCM] 토큰 등록 실패:", error);
  }
}
