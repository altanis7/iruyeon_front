/**
 * 프로필 API 및 타입 정의
 */

/**
 * 가족 구성원 정보 (기획서 기준 - 간소화)
 */
export interface FamilyMember {
  name: string; // 이름 (필수)
  relationship: string; // 관계 (필수) - PATCH API 기준 소문자 통일
  job?: string; // 직업 (선택)
  birthYear?: number; // 출생년도 (선택)
  religion?: string; // 종교 (선택)
  jobDetail?: string; // 직업 상세 (선택)
  address?: string; // 주소 (선택)
  university?: string; // 대학교 (선택)
  property?: string; // 재산 (선택)
  info?: string; // 기타 정보 (선택)
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

  // 만남 횟수
  totalMeetingCnt?: number; // 전체 만남 횟수

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
  memberImage: string | null;
  clientId: number;
  clientName: string;
  clientImage: string;
  address: string;
  university: string;
  job: string;
  gender: string;
  height: number;
  birthYear: number;
  status: "ACTIVE" | "INACTIVE";
  totalMeetingCnt: number;
  currentMeetingCnt: number;
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
  memberId: number;
  memberName: string;
  memberImage: string | null;
  status: "ACTIVE" | "INACTIVE";
}

// 내 회원 리스트 아이템 (GET /client/my 응답)
export interface MyClientListItem {
  memberId: number;
  memberName: string;
  memberImage: string | null;
  clientId: number;
  clientName: string;
  clientImage: string | null;
  address: string;
  university: string;
  job: string;
  gender: string;
  height: number;
  birthYear: number;
  totalMeetingCnt?: number; // 전체 만남 횟수
  currentMeetingCnt?: number; // 현재 만남 횟수
  status: "ACTIVE" | "INACTIVE"; // 활동 상태
}

// 내 회원 페이지네이션 응답 데이터
export interface MyClientListData {
  totalPages: number;
  currentPage: number;
  list: MyClientListItem[];
}

// 내 회원 UI 표시용 데이터 (상태 포함)
export interface MyClientDisplayData {
  id: string;
  name: string;
  image: string | null;
  job: string;
  birthYear: number;
  university: string;
  address: string;
  gender: string;
  height: number;
  totalMeetingCnt?: number;
  currentMeetingCnt?: number;
  status: "ACTIVE" | "INACTIVE";
}

// 클라이언트 가족 구성원 정보 (GET /client/:id 응답)
export interface ClientFamilyMember {
  relationship: string; // 관계 (아버지, 어머니 등)
  name: string; // 이름
  birthYear: number; // 출생년도
  address: string; // 주소
  property: string; // 재산
  university: string; // 대학교
  job: string | null; // 직업
  jobDetail: string; // 직업 상세
  religion: string; // 종교
  info: string | null; // 기타 정보
}

// 클라이언트 가족 구성원 정보 (GET /client/:id/info 응답)
export interface ClientInfoFamilyMember {
  relationship: string;
  name: string;
  age: string; // "68세 (1958년생)" 형식
  address: string;
  property: string;
  university: string;
  major: string | null; // 전공 (새 필드)
  job: string | null;
  jobDetail: string;
  religion: string;
  info: string | null;
  maritalStatus: string | null; // 혼인상태 (새 필드)
}

// 클라이언트 상세 정보 (GET /client/:id 응답)
export interface ClientDetail {
  id: number;
  memberId: number;
  name: string;
  address: string;
  age: string; // API에서 "33세 (1993년생)" 형식으로 제공
  height: number;
  religion: string;
  eduLevel: string; // 학력
  highSchool: string; // 고등학교
  university: string; // 대학교
  job: string; // 직업
  jobDetail: string; // 직업 상세
  previousJob: string; // 이전 직업
  info: string; // 기타 특이사항
  homeTown: string; // 본가
  gender: string; // 성별
  status: string; // 상태 (ACTIVE 등)
  minPreferredAge: number; // 희망 최소 나이
  maxPreferredAge: number; // 희망 최대 나이
  idealType: string; // 이상형
  personality: string; // 성격
  property: string; // 재산
  major: string; // 전공
  hobby: string; // 취미
  maritalStatus: string; // 혼인상태
  phoneNumber: string | null;
  profileImages: string[]; // 프로필 이미지 배열 (최대 3개)
  families: ClientFamilyMember[]; // 가족 구성원 배열
}

// 클라이언트 상세 정보 (GET /client/:id/info 응답)
export interface ClientInfoDetail extends Omit<ClientDetail, "families"> {
  interest: string; // 관심사 (새 필드)
  childCnt: number; // 자녀 수 (새 필드)
  families: ClientInfoFamilyMember[]; // 새 가족 타입
}

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

  /**
   * 클라이언트 상세 조회
   */
  getClientById: async (
    clientId: string,
  ): Promise<ApiResponse<ClientDetail>> => {
    const response = await apiClient.get<ApiResponse<ClientDetail>>(
      `/client/${clientId}`,
    );
    return response.data;
  },

  /**
   * 클라이언트 상세 정보 조회 (프로필 관리용)
   */
  getClientInfoById: async (
    clientId: string,
  ): Promise<ApiResponse<ClientInfoDetail>> => {
    const response = await apiClient.get<ApiResponse<ClientInfoDetail>>(
      `/client/${clientId}/info`,
    );
    return response.data;
  },

  /**
   * 내 회원 목록 조회 (페이지네이션)
   */
  getMyClients: async (
    params: PaginationParams,
  ): Promise<ApiResponse<MyClientListData>> => {
    const response = await apiClient.get<ApiResponse<MyClientListData>>(
      "/client/my",
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * 클라이언트 생성
   */
  createClient: async (
    profile: Omit<Profile, "id">,
  ): Promise<ApiResponse<ClientDetail>> => {
    const response = await apiClient.post<ApiResponse<ClientDetail>>(
      "/client",
      profile,
    );
    return response.data;
  },

  /**
   * 클라이언트 검색
   */
  searchClients: async (
    params: SearchProfileParams,
  ): Promise<ApiResponse<ClientListData>> => {
    const response = await apiClient.post<ApiResponse<ClientListData>>(
      "/client/search",
      params,
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
    memberId: client.memberId,
    memberName: client.memberName,
    memberImage: client.memberImage,
    status: client.status,
  };
}

/**
 * MyClientListItem을 UI 표시용 MyClientDisplayData로 변환
 */
export function mapMyClientToDisplay(
  client: MyClientListItem,
): MyClientDisplayData {
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
    totalMeetingCnt: client.totalMeetingCnt,
    currentMeetingCnt: client.currentMeetingCnt,
    status: client.status,
  };
}

/**
 * ========================================
 * Client Management API Types
 * ========================================
 */

// 상태 전환 API
export interface ToggleStatusRequest {
  memberId: number;
}

export interface ToggleStatusResponse {
  clientId: number;
  newStatus: "ACTIVE" | "INACTIVE";
  message: string;
}

// 클라이언트 수정 API
export interface UpdateClientRequest {
  clientId: number;

  // 필수 필드
  name: string;
  phoneNumber: string;
  gender: string;
  birthYear: number;
  address: string;
  eduLevel: string;
  job: string;
  height: number;
  religion: string;
  maritalStatus: string;

  // 선택 필드
  imageIdList?: number[];
  university?: string;
  highSchool?: string;
  major?: string;
  jobDetail?: string;
  previousJob?: string;
  property?: string;
  hobby?: string;
  personality?: string;
  idealType?: string;
  homeTown?: string;
  info?: string;
  minPreferredAge?: number;
  maxPreferredAge?: number;

  // 만남 횟수
  totalMeetingCnt?: number; // 전체 만남 횟수

  // 가족 정보
  family?: Array<{
    relationship: string;
    name: string;
    birthYear: number;
    address: string;
    property: string;
    university: string;
    job: string | null;
    jobDetail: string;
    religion: string;
    info: string | null;
  }>;
}

// 클라이언트 삭제 API
export interface DeleteClientRequest {
  clientId: number;
}

export interface DeleteClientResponse {
  success: boolean;
  message: string;
}

/**
 * ========================================
 * Client Management API Functions
 * ========================================
 */

// clientApi 객체에 새로운 메서드 추가
export const clientManagementApi = {
  /**
   * 클라이언트 상태 토글 (ACTIVE ↔ INACTIVE)
   */
  toggleClientStatus: async (
    memberId: number,
  ): Promise<ApiResponse<ToggleStatusResponse>> => {
    const response = await apiClient.post<ApiResponse<ToggleStatusResponse>>(
      `/client/status/${memberId}`,
    );
    return response.data;
  },

  /**
   * 클라이언트 정보 수정
   */
  updateClient: async (
    data: UpdateClientRequest,
  ): Promise<ApiResponse<ClientDetail>> => {
    const { clientId, ...updateData } = data;
    const response = await apiClient.patch<ApiResponse<ClientDetail>>(
      `/client/${clientId}`,
      updateData,
    );
    return response.data;
  },

  /**
   * 클라이언트 삭제
   */
  deleteClient: async (
    clientId: number,
  ): Promise<ApiResponse<DeleteClientResponse>> => {
    const response = await apiClient.delete<
      ApiResponse<DeleteClientResponse>
    >(`/client`, {
      params: { id: clientId },
    });
    return response.data;
  },
};
