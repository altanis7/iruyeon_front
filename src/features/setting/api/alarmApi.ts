import { apiClient } from "@/lib/api/client";

// Types
export interface AlarmSetting {
  chatPush: boolean;
  matchPush: boolean;
}

export interface AlarmSettingResponse {
  data: AlarmSetting;
  status: number;
  message: string;
  responseTime: string;
}

export interface UpdateAlarmSettingRequest {
  chatPush: boolean;
  matchPush: boolean;
}

export interface ApiResponse {
  status: number;
  message: string;
}

// API functions
export async function getAlarmSetting(): Promise<AlarmSettingResponse> {
  const response = await apiClient.get<AlarmSettingResponse>("/alarm/setting");
  return response.data;
}

export async function updateAlarmSetting(
  data: UpdateAlarmSettingRequest,
): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>("/alarm/setting", data);
  return response.data;
}
