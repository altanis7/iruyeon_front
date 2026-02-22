/**
 * 매칭 API 및 타입 정의
 */

import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/features/profile/api/profileApi";

/**
 * 매칭 상태
 */
export type MatchStatus =
  | "UNREAD"
  | "CANCELED"
  | "REJECTED"
  | "PENDING"
  | "ACCEPTED"
  | "MATCHED"
  | "DEACTIVATED_USER";

/**
 * 멤버+클라이언트 정보 DTO (API 응답 구조)
 */
export interface MemberClientDTO {
  memberId: number;
  memberName: string;
  memberImage: string | null;
  clientId: number;
  clientName: string;
  clientImage: string | null;
  clientJob: string;
  clientSchool: string;
}

/**
 * 매칭 아이템 (API 응답 구조 - received/sent/matched 공통)
 */
export interface ReceivedMatch {
  matchId: number;
  matchStatus: MatchStatus;
  newChatCnt: number;
  oppositeMemberClientDTO: MemberClientDTO;
  memberClientResponseDTO: MemberClientDTO;
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
 * 채팅 메시지
 */
export interface ChatMessage {
  id: number;
  senderId: number;
  message: string;
  createdAt: string;
}

/**
 * 채팅 데이터 (API 응답)
 */
export interface ChatData {
  chatRoomId: number;
  oppositeMemberImage: string | null;
  oppositeMemberName: string;
  message: ChatMessage[];
}

/**
 * 채팅 전송 요청
 */
export interface SendChatRequest {
  matchId: number;
  message: string;
}

/**
 * 매칭 신청 요청
 */
export interface SendMatchRequest {
  fromClientId: number;
  toClientId: number;
  message: string;
}

/**
 * 매칭 취소 요청
 */
export interface CancelMatchRequest {
  matchId: number;
}

/**
 * 매칭 알림 카운트 데이터
 */
export interface MatchAlarmData {
  receivedMatchAlarmCnt: number; // 받은 매칭탭 알림 개수
  sentMatchAlarmCnt: number; // 보낸 매칭탭 알림 개수
  matchedMatchAlarmCnt: number; // 매칭 완료탭 알림 개수
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

  /**
   * 채팅 내역 조회
   */
  getChat: async (matchId: number): Promise<ApiResponse<ChatData>> => {
    const response = await apiClient.get<ApiResponse<ChatData>>(
      `/match/chat/${matchId}`,
    );
    return response.data;
  },

  /**
   * 채팅 메시지 전송
   */
  sendChat: async (request: SendChatRequest): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      "/match/chat",
      request,
    );
    return response.data;
  },

  /**
   * 매칭 알림 개수 조회
   */
  getMatchAlarm: async (): Promise<ApiResponse<MatchAlarmData>> => {
    const response = await apiClient.get<ApiResponse<MatchAlarmData>>(
      "/match/alarm",
    );
    return response.data;
  },

  /**
   * 매칭 신청
   */
  sendMatchRequest: async (
    request: SendMatchRequest,
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      "/match/send",
      request,
    );
    return response.data;
  },

  /**
   * 보낸 매칭 취소
   * PENDING 또는 UNREAD 상태에서만 취소 가능
   */
  cancelSentMatch: async (
    request: CancelMatchRequest,
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      "/match/sent/cancel",
      request,
    );
    return response.data;
  },
};
