import { toast } from "sonner";

// === 타입 정의 ===

export interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
  };
  data?: {
    type?: "chat" | "match_request" | "match_accepted";
    id?: string;
    url?: string;
  };
}

export interface ParsedNotification {
  title: string;
  body: string;
  type: string;
  id?: string;
  url: string;
}

// === 유틸리티 함수 ===

/**
 * FCM 페이로드를 파싱하여 표준 형식으로 변환
 */
export function formatNotificationPayload(
  payload: NotificationPayload
): ParsedNotification {
  const title = payload.notification?.title || "새 알림";
  const body = payload.notification?.body || "";
  const type = payload.data?.type || "unknown";
  const id = payload.data?.id;
  const url = payload.data?.url || getNotificationRoute(type, id);

  return {
    title,
    body,
    type,
    id,
    url,
  };
}

/**
 * 알림 타입과 ID를 기반으로 이동할 경로 결정
 */
export function getNotificationRoute(type: string, id?: string): string {
  switch (type) {
    case "chat":
      return id ? `/chat/${id}` : "/chat";
    case "match_request":
      return "/match/received";
    case "match_accepted":
      return id ? `/match/${id}` : "/match";
    default:
      return "/";
  }
}

/**
 * Foreground에서 알림을 토스트로 표시
 */
export function showForegroundNotification(payload: NotificationPayload): void {
  const notification = formatNotificationPayload(payload);

  toast(notification.title, {
    description: notification.body,
    duration: 5000,
    action: {
      label: "확인",
      onClick: () => {
        window.location.href = notification.url;
      },
    },
  });
}

/**
 * FCM onMessage 리스너 설정 (App.tsx나 Provider에서 사용)
 */
export function setupForegroundListener(
  messaging: any,
  onMessageReceived?: (payload: NotificationPayload) => void
): () => void {
  if (!messaging) {
    return () => {};
  }

  // Firebase의 onMessage import 필요
  const { onMessage } = require("firebase/messaging");

  const unsubscribe = onMessage(messaging, (payload: NotificationPayload) => {
    console.log("Foreground message received:", payload);

    // 커스텀 핸들러가 있으면 호출, 없으면 기본 토스트 표시
    if (onMessageReceived) {
      onMessageReceived(payload);
    } else {
      showForegroundNotification(payload);
    }
  });

  return unsubscribe;
}

/**
 * 알림 타입별 아이콘 경로 반환
 */
export function getNotificationIcon(type: string): string {
  switch (type) {
    case "chat":
      return "/icon-chat.png";
    case "match_request":
      return "/icon-match.png";
    case "match_accepted":
      return "/icon-heart.png";
    default:
      return "/icon-192x192.png";
  }
}
