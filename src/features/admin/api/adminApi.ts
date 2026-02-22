import { apiClient } from "@/lib/api/client";

// ========== 타입 정의 ==========

export interface AdminMember {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  company: string;
  gender: string;
  memberImage: string | null;
}

export interface AdminMemberListResponse {
  data: {
    totalPages: number;
    currentPage: number;
    list: AdminMember[];
  };
  status: number;
  message: string;
  responseTime: string;
}

export interface AdminMemberListParams {
  page?: number;
  size?: number;
}

// ========== API 함수 ==========

/**
 * 관리자 - 모든 매니저 목록 조회
 */
export const getAdminMembers = async (
  params?: AdminMemberListParams
): Promise<AdminMemberListResponse> => {
  const response = await apiClient.get<AdminMemberListResponse>("/admin/member", {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    },
  });
  return response.data;
};

// ========== 승인 대기 관련 타입 ==========

export interface PendingMemberListResponse {
  data: {
    totalPages: number;
    currentPage: number;
    list: AdminMember[];
  };
  status: number;
  message: string;
  responseTime: string;
}

export interface MemberActionResponse {
  status: number;
  message: string;
  responseTime: string;
}

// ========== 승인 대기 API 함수 ==========

/**
 * 관리자 - 승인 대기중인 매니저 목록 조회
 */
export const getPendingMembers = async (
  params?: AdminMemberListParams
): Promise<PendingMemberListResponse> => {
  const response = await apiClient.get<PendingMemberListResponse>("/admin/member/pending", {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    },
  });
  return response.data;
};

/**
 * 관리자 - 매니저 승인
 */
export const approveMember = async (memberId: number): Promise<MemberActionResponse> => {
  const response = await apiClient.post<MemberActionResponse>(`/admin/member/approve/${memberId}`);
  return response.data;
};

/**
 * 관리자 - 매니저 거부
 */
export const rejectMember = async (memberId: number): Promise<MemberActionResponse> => {
  const response = await apiClient.post<MemberActionResponse>(`/admin/member/reject/${memberId}`);
  return response.data;
};
