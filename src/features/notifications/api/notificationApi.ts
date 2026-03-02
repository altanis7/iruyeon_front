import { apiClient } from "@/lib/api/client";

// === 타입 정의 ===

export interface PushTokenRequest {
  token: string;
  deviceType: "web" | "ios" | "android";
}

export interface NotificationSettings {
  chatEnabled: boolean;
  matchRequestEnabled: boolean;
  matchAcceptedEnabled: boolean;
}

export interface NotificationSettingsResponse {
  data: NotificationSettings;
  status: number;
  message: string;
}

export interface ApiResponse {
  status: number;
  message: string;
}

// === API 함수 ===

export const notificationApi = {
  /**
   * 푸시 토큰을 백엔드에 등록
   */
  registerPushToken: async (
    request: PushTokenRequest
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      "/notifications/token",
      request
    );
    return response.data;
  },

  /**
   * 푸시 토큰을 백엔드에서 제거
   */
  unregisterPushToken: async (token: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(
      `/notifications/token/${token}`
    );
    return response.data;
  },

  /**
   * 알림 설정 조회
   */
  getNotificationSettings: async (): Promise<NotificationSettingsResponse> => {
    const response = await apiClient.get<NotificationSettingsResponse>(
      "/notifications/settings"
    );
    return response.data;
  },

  /**
   * 알림 설정 업데이트
   */
  updateNotificationSettings: async (
    settings: Partial<NotificationSettings>
  ): Promise<ApiResponse> => {
    const response = await apiClient.patch<ApiResponse>(
      "/notifications/settings",
      settings
    );
    return response.data;
  },
};
