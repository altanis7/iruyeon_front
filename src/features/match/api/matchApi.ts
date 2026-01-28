/**
 * 매칭 API 및 타입 정의
 */

import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/features/profile/api/profileApi";

/**
 * 매칭 상태
 */
export type MatchStatus =
  | "CANCELED"
  | "REJECTED"
  | "PENDING"
  | "ACCEPTED"
  | "MATCHED";

/**
 * 매칭 상대방 클라이언트 정보
 */
export interface MemberClientInfo {
  memberId: number;
  memberName: string;
  memberImage: string;
  clientId: number;
  clientName: string;
  clientImage: string;
  age: string; // "32세 (1993년생)" 형식
  address: string;
  university: string;
  job: string;
  gender: string;
}

/**
 * 받은 매칭 아이템
 */
export interface ReceivedMatch {
  matchId: number;
  matchStatus: MatchStatus;
  message: string;
  memberClientResponseDTO: MemberClientInfo;
  openAt: string; // ISO datetime
  reply: string | null;
}

/**
 * 페이지네이션 응답 데이터
 */
export interface ReceivedMatchesData {
  totalPages: number;
  currentPage: number;
  list: ReceivedMatch[];
}

/**
 * 페이지네이션 파라미터
 */
export interface ReceivedMatchesParams {
  page: number;
  size: number;
}

/**
 * 매칭 API 함수
 */
export const matchApi = {
  /**
   * 받은 매칭 목록 조회 (페이지네이션)
   */
  getReceivedMatches: async (
    params: ReceivedMatchesParams,
  ): Promise<ApiResponse<ReceivedMatchesData>> => {
    const response = await apiClient.get<ApiResponse<ReceivedMatchesData>>(
      "/match/received",
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * 보낸 매칭 목록 조회 (페이지네이션)
   */
  getSentMatches: async (
    params: ReceivedMatchesParams,
  ): Promise<ApiResponse<ReceivedMatchesData>> => {
    const response = await apiClient.get<ApiResponse<ReceivedMatchesData>>(
      "/match/sent",
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * 매칭 완료 목록 조회 (페이지네이션)
   */
  getMatchedMatches: async (
    params: ReceivedMatchesParams,
  ): Promise<ApiResponse<ReceivedMatchesData>> => {
    const response = await apiClient.get<ApiResponse<ReceivedMatchesData>>(
      "/match/matched",
      {
        params,
      },
    );
    return response.data;
  },
};
