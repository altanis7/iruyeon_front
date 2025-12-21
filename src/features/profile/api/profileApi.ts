/**
 * 프로필 API 및 타입 정의
 */

/**
 * 가족 구성원 정보 (기획서 기준 - 간소화)
 */
export interface FamilyMember {
  name: string; // 이름 (필수)
  relationShip: string; // 관계 (필수) - API 필드명
  job?: string; // 직업 (선택)
  birthYear?: number; // 출생년도 (선택)
  religion?: string; // 종교 (선택)
}

// 프로필 타입 정의 (API 필드명과 일치)
// 필수 필드: 10개 (name, phoneNumber, gender, birthYear, address, eduLevel, job, height, religion, maritalStatus)
export interface Profile {
  id?: string; // 생성 시 선택

  // ===== 필수 필드 (10개) =====
  name: string; // 이름
  phoneNumber: string; // 전화번호
  gender: string; // 성별
  birthYear: number; // 출생년도
  address: string; // 거주지
  eduLevel: string; // 학력
  job: string; // 직업
  height: number; // 키
  religion: string; // 종교
  maritalStatus: string; // 혼인 여부

  // ===== 선택 필드 =====
  // 사진
  imageIdList?: number[]; // photos(string[]) → imageIdList(number[])

  // 학력 상세
  university?: string; // 대학교명 - school → university
  highSchool?: string; // 고등학교
  major?: string; // 전공

  // 직업 상세
  jobDetail?: string; // 직업 상세
  previousJob?: string; // 이전 직업

  // 재산/취미
  property?: string; // 재산 - assets → property ("5억", "10억")
  hobby?: string; // 취미 - hobbies → hobby

  // 성격/이상형
  personality?: string; // 성격 - 키워드 쉼표 연결
  idealType?: string; // 이상형 - 키워드 쉼표 연결

  // 본가/기타
  homeTown?: string; // 본가 - hometown → homeTown
  info?: string; // 기타 특이사항 (최대 100자) - notes → info

  // 희망 상대 조건
  minPreferredAge?: number; // 희망 나이 최소
  maxPreferredAge?: number; // 희망 나이 최대

  // 가족 정보
  family?: FamilyMember[]; // familyMembers → family
}

// 나이 계산 유틸리티
export const calculateAge = (birthYear: number): number => {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear + 1; // 한국 나이
};

// 검색 파라미터
export interface SearchProfileParams {
  keyword: string;
}

import { apiClient } from "@/lib/api/client";

/**
 * ========================================
 * Client API Types (새로운 페이지네이션 API)
 * ========================================
 */

// API 응답 wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  responseTime: string;
}

// 클라이언트 리스트 아이템 (GET /client 응답)
export interface ClientListItem {
  memberId: number;
  memberName: string;
  memberImage: string;
  clientId: number;
  clientName: string;
  clientImage: string;
  address: string;
  university: string;
  job: string;
  gender: string;
  height: number;
  birthYear: number;
}

// 페이지네이션 응답 데이터
export interface ClientListData {
  totalPages: number;
  currentPage: number;
  list: ClientListItem[];
}

// 페이지네이션 파라미터
export interface PaginationParams {
  page: number;
  size: number;
}

// UI 표시용 데이터 (ClientListItem을 컴포넌트에서 사용하기 쉬운 형태로 변환)
export interface ClientDisplayData {
  id: string;
  name: string;
  image: string;
  job: string;
  birthYear: number;
  university: string;
  address: string;
  gender: string;
  height: number;
  memberName: string;
  memberImage: string;
}

/**
 * ========================================
 * Profile API (기존)
 * ========================================
 */

// API 함수들
export const profileApi = {
  /**
   * 프로필 목록 조회
   */
  getProfiles: async (): Promise<Profile[]> => {
    const response = await apiClient.get<Profile[]>("/profiles");
    return response.data;
  },

  /**
   * 프로필 상세 조회
   */
  getProfileById: async (id: string): Promise<Profile | null> => {
    try {
      const response = await apiClient.get<Profile>(`/profiles/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * 프로필 검색
   * 검색 기준: 나이, 직업, 학벌, 종교, 지역
   */
  searchProfiles: async (params: SearchProfileParams): Promise<Profile[]> => {
    const response = await apiClient.post<Profile[]>(
      "/profiles/search",
      params,
    );
    return response.data;
  },

  /**
   * 프로필 삭제
   */
  deleteProfile: async (id: string): Promise<void> => {
    await apiClient.delete(`/profiles/${id}`);
  },

  /**
   * 프로필 생성
   */
  createProfile: async (profile: Omit<Profile, "id">): Promise<Profile> => {
    const response = await apiClient.post<Profile>("/profiles", profile);
    return response.data;
  },

  /**
   * 프로필 수정
   */
  updateProfile: async (
    id: string,
    updates: Partial<Profile>,
  ): Promise<Profile> => {
    const response = await apiClient.put<Profile>(`/profiles/${id}`, updates);
    return response.data;
  },
};

/**
 * ========================================
 * Client API (새로운 페이지네이션 API)
 * ========================================
 */
export const clientApi = {
  /**
   * 클라이언트 목록 조회 (페이지네이션)
   */
  getClients: async (
    params: PaginationParams,
  ): Promise<ApiResponse<ClientListData>> => {
    const response = await apiClient.get<ApiResponse<ClientListData>>(
      "/client",
      {
        params,
      },
    );
    return response.data;
  },
};

/**
 * ClientListItem을 UI 표시용 ClientDisplayData로 변환
 */
export function mapClientToDisplay(
  client: ClientListItem,
): ClientDisplayData {
  return {
    id: String(client.clientId),
    name: client.clientName,
    image: client.clientImage,
    job: client.job,
    birthYear: client.birthYear,
    university: client.university,
    address: client.address,
    gender: client.gender,
    height: client.height,
    memberName: client.memberName,
    memberImage: client.memberImage,
  };
}
