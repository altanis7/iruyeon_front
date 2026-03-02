import { useEffect, useState, ReactNode } from "react";
import { onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getMessagingInstance } from "@/lib/firebase";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNotificationPermission } from "../hooks/useNotificationPermission";
import { NotificationPrompt } from "./NotificationPrompt";

interface NotificationProviderProps {
  children: ReactNode;
}

const PROMPT_DISMISSED_KEY = "notification_prompt_dismissed";

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { isAuthenticated } = useAuth();
  const { permission } = useNotificationPermission();
  const [showPrompt, setShowPrompt] = useState(false);
  const queryClient = useQueryClient();

  // Foreground 메시지 수신 리스너
  useEffect(() => {
    const messaging = getMessagingInstance();
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      const title = payload.notification?.title || "새 알림";
      const body = payload.notification?.body || "";
      const notificationType = payload.data?.type;

      // Sonner toast로 표시
      toast(title, {
        description: body,
        duration: 5000,
        action: payload.data?.url
          ? {
              label: "확인",
              onClick: () => {
                window.location.href = payload.data.url;
              },
            }
          : undefined,
      });

      // 알림 타입에 따라 관련 캐시 무효화
      if (notificationType === "match_request" || notificationType === "match_accepted") {
        // 매칭 알림 배지 업데이트
        queryClient.invalidateQueries({ queryKey: ["matches", "alarm"] });
        // 매칭 목록도 새로고침
        queryClient.invalidateQueries({ queryKey: ["matches"] });
      }

      if (notificationType === "chat") {
        // 채팅 알림 처리 (향후 채팅 기능 구현 시 추가)
        // queryClient.invalidateQueries({ queryKey: ["chats", "alarm"] });
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  // 로그인 후 권한 요청 프롬프트 표시
  useEffect(() => {
    if (!isAuthenticated) {
      setShowPrompt(false);
      return;
    }

    // 이미 권한이 있거나 거부되었으면 표시 안 함
    if (permission !== "default") {
      return;
    }

    // 이미 한 번 닫았으면 표시 안 함
    const isDismissed = localStorage.getItem(PROMPT_DISMISSED_KEY);
    if (isDismissed) {
      return;
    }

    // 2-3초 딜레이 후 프롬프트 표시
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, permission]);

  const handleDismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
  };

  return (
    <>
      {children}
      {showPrompt && <NotificationPrompt onDismiss={handleDismissPrompt} />}
    </>
  );
}
