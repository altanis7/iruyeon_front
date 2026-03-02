import { apiClient } from "@/lib/api/client";

// === 타입 정의 ===

export interface RegisterFCMTokenRequest {
  fcmToken: string;
}

export interface RegisterFCMTokenResponse {
  success: boolean;
  message?: string;
}

// === API 함수 ===

export const fcmApi = {
  /**
   * FCM 토큰을 백엔드에 등록
   */
  registerToken: async (
    fcmToken: string
  ): Promise<RegisterFCMTokenResponse> => {
    const response = await apiClient.post<RegisterFCMTokenResponse>(
      "/alarm/fcm",
      { fcmToken }
    );
    return response.data;
  },
};
