import { initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  projectId: import.meta.env.VITE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;

export const getMessagingInstance = () => {
  if (typeof window === "undefined") return null;
  if (!messaging) {
    messaging = getMessaging(app);
  }
  return messaging;
};
