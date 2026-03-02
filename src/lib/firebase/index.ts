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
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const messagingInstance = getMessagingInstance();
    if (!messagingInstance) return;

    const token = await getToken(messagingInstance, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    });
    if (!token) return;

    await apiClient.post("/alarm/fcm", { fcmToken: token });
  } catch (error) {
    console.error("FCM token registration failed:", error);
  }
}
