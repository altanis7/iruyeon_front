import { Button } from "@/shared/components/ui/button";
import { ToggleSwitch } from "@/shared/components/ui/toggle-switch";
import { useNotificationPermission } from "../hooks/useNotificationPermission";
import { usePushToken } from "../hooks/usePushToken";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "../hooks/useNotificationSettings";

interface NotificationCategory {
  id: keyof {
    chatEnabled: boolean;
    matchRequestEnabled: boolean;
    matchAcceptedEnabled: boolean;
  };
  label: string;
  description: string;
}

const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: "chatEnabled",
    label: "채팅 알림",
    description: "새로운 메시지가 도착하면 알림을 받습니다",
  },
  {
    id: "matchRequestEnabled",
    label: "매칭 요청 알림",
    description: "새로운 매칭 요청이 오면 알림을 받습니다",
  },
  {
    id: "matchAcceptedEnabled",
    label: "매칭 성사 알림",
    description: "매칭이 성사되면 알림을 받습니다",
  },
];

export function NotificationSettings() {
  const { permission, requestPermission, hasPermission, isDenied } =
    useNotificationPermission();
  const { generateToken, isGenerating } = usePushToken();
  const { data, isLoading } = useNotificationSettings();
  const { mutate } = useUpdateNotificationSettings();

  const handlePermissionRequest = async () => {
    const result = await requestPermission();
    if (result === "granted") {
      await generateToken();
    }
  };

  const handleToggle = (
    category: NotificationCategory["id"],
    value: boolean
  ) => {
    mutate({ [category]: value });
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  const settings = data?.data;

  return (
    <div className="space-y-4">
      {/* 권한 상태 */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold mb-2">알림 권한</h3>

        {permission === "default" && (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              브라우저 푸시 알림을 받으려면 권한을 허용해주세요
            </p>
            <Button
              onClick={handlePermissionRequest}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "처리 중..." : "알림 허용하기"}
            </Button>
          </div>
        )}

        {hasPermission && (
          <div className="flex items-center gap-2 text-green-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm">알림이 활성화되었습니다</span>
          </div>
        )}

        {isDenied && (
          <div className="text-sm text-red-600">
            <p className="font-medium mb-1">알림이 차단되었습니다</p>
            <p className="text-xs">
              브라우저 설정에서 알림 권한을 허용해주세요
            </p>
          </div>
        )}
      </div>

      {/* 카테고리별 토글 (권한이 있을 때만 표시) */}
      {hasPermission && settings && (
        <div className="space-y-3">
          <h3 className="font-semibold">알림 설정</h3>
          {NOTIFICATION_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex-1">
                <p className="font-medium">{category.label}</p>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
              <ToggleSwitch
                checked={settings[category.id]}
                onCheckedChange={(value) => handleToggle(category.id, value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
