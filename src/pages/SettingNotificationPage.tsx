import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import RootLayout from "@/shared/components/layouts/RootLayout";
import { Button } from "@/shared/components/ui/button";
import { ToggleSwitch } from "@/shared/components/ui/toggle-switch";
import { useAlarmSetting } from "@/features/setting/hooks/useAlarmSetting";
import { useUpdateAlarmSetting } from "@/features/setting/hooks/useUpdateAlarmSetting";
import { useFCMToken } from "@/features/setting/hooks/useFCMToken";

interface NotificationSetting {
  id: string;
  label: string;
  description?: string;
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { id: "all", label: "전체 알림", description: "모든 알림을 받습니다" },
  { id: "match", label: "매칭 알림", description: "새로운 매칭 알림" },
  { id: "chat", label: "채팅 알림", description: "새로운 메시지 알림" },
];

export function SettingNotificationPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useAlarmSetting();
  const { mutate } = useUpdateAlarmSetting();
  const { permission, requestPermission, hasPermission } = useFCMToken();

  const handleToggle = (type: string, value: boolean) => {
    if (type === "all") {
      mutate({ chatPush: value, matchPush: value });
    } else if (type === "match") {
      mutate({ chatPush: data?.data.chatPush ?? false, matchPush: value });
    } else if (type === "chat") {
      mutate({ chatPush: value, matchPush: data?.data.matchPush ?? false });
    }
  };

  if (isLoading) {
    return (
      <RootLayout>
        <div className="flex flex-col h-full items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </RootLayout>
    );
  }

  const alarmData = data?.data || { chatPush: false, matchPush: false };
  const isAllEnabled = alarmData.chatPush && alarmData.matchPush;

  return (
    <RootLayout>
      <div className="flex flex-col h-full">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white z-10 px-4 pt-3 pb-3 border-b">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">알림 설정</h1>
            <div className="w-9" />
          </div>
        </div>

        {/* 알림 설정 목록 */}
        <div className="flex-1 px-4 py-4">
          <div className="space-y-4">
            {NOTIFICATION_SETTINGS.map((setting) => {
              let checked = false;
              if (setting.id === "all") {
                checked = isAllEnabled;
              } else if (setting.id === "match") {
                checked = alarmData.matchPush;
              } else if (setting.id === "chat") {
                checked = alarmData.chatPush;
              }

              return (
                <div
                  key={setting.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium">{setting.label}</p>
                    {setting.description && (
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    )}
                  </div>
                  <ToggleSwitch
                    checked={checked}
                    onCheckedChange={(value) => handleToggle(setting.id, value)}
                  />
                </div>
              );
            })}
          </div>

          {/* FCM 푸시 알림 권한 설정 */}
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-2">푸시 알림 설정</h3>
            <p className="text-sm text-gray-600 mb-4">
              브라우저 푸시 알림을 받으려면 권한을 허용해주세요
            </p>

            {permission === "default" && (
              <Button
                onClick={requestPermission}
                className="w-full"
              >
                푸시 알림 허용하기
              </Button>
            )}

            {permission === "granted" && (
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
                <span>푸시 알림이 활성화되었습니다</span>
              </div>
            )}

            {permission === "denied" && (
              <div className="text-sm text-red-600">
                <p className="font-medium mb-1">푸시 알림이 차단되었습니다</p>
                <p className="text-xs">
                  브라우저 설정에서 알림 권한을 허용해주세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
