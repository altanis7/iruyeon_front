import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { useNotificationPermission } from "../hooks/useNotificationPermission";
import { usePushToken } from "../hooks/usePushToken";

interface NotificationPromptProps {
  onDismiss?: () => void;
}

export function NotificationPrompt({ onDismiss }: NotificationPromptProps) {
  const { requestPermission, hasPermission, isDenied } =
    useNotificationPermission();
  const { generateToken } = usePushToken();
  const [isRequesting, setIsRequesting] = useState(false);

  // 이미 권한이 있거나 거부된 경우 표시하지 않음
  if (hasPermission || isDenied) {
    return null;
  }

  const handleAllow = async () => {
    setIsRequesting(true);
    try {
      const result = await requestPermission();
      if (result === "granted") {
        await generateToken();
      }
    } finally {
      setIsRequesting(false);
      onDismiss?.();
    }
  };

  const handleLater = () => {
    onDismiss?.();
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 mx-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-base mb-1">알림 받기</h3>
          <p className="text-sm text-gray-600">
            새로운 매칭이나 메시지를 실시간으로 받아보세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleLater}
            className="flex-1"
            disabled={isRequesting}
          >
            나중에
          </Button>
          <Button
            onClick={handleAllow}
            className="flex-1"
            disabled={isRequesting}
          >
            {isRequesting ? "처리 중..." : "알림 받기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
