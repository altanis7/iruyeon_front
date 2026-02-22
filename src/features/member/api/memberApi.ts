import { apiClient } from "@/lib/api/client";

// Phone number format utilities
export function formatPhoneForDisplay(phone: string): string {
  // "01012345678" → "010-1234-5678"
  const cleaned = phone.replace(/-/g, "");
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function formatPhoneForApi(phone: string): string {
  // "010-1234-5678" → "01012345678"
  return phone.replace(/-/g, "");
}

// Types
export interface MemberData {
  id: number;
  email: string;
  name: string;
  phoneNumber: string; // API format: "01012345678"
  company: string;
  gender: string;
  memberImage: string | null;
}

export interface MemberResponse {
  data: MemberData;
  status: number;
  message: string;
}

export interface UpdateMemberRequest {
  name: string;
  pwd?: string; // new password (only if changing)
  currentPwd?: string; // current password for server verification
  phoneNumber: string; // API format: "01012345678"
  gender: string;
  company: string;
  imageId?: number; // only if image was changed
}

export interface ApiResponse {
  status: number;
  message: string;
}

// API functions
export async function getMember(memberId: string): Promise<MemberResponse> {
  const response = await apiClient.get<MemberResponse>(`/member/${memberId}`);
  return response.data;
}

export async function updateMember(
  memberId: string,
  data: UpdateMemberRequest,
): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>(
    `/member/${memberId}`,
    data,
  );
  return response.data;
}
