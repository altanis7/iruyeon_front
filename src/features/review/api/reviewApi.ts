/**
 * 만남 후기 API 및 타입 정의
 */

import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/features/profile/api/profileApi";

/**
 * 후기 작성 요청
 */
export interface CreateReviewRequest {
  clientId: number;    // 후기 대상 클라이언트 ID
  content: string;     // 후기 내용
  matchId: number;     // 매칭 ID
}

/**
 * 후기 목록 아이템
 */
export interface ReviewListItem {
  reviewId: number;
  clientId: number;
  clientName: string;
  memberName: string;
  createdAt: string;
  content: string;
  matchId: number;
}

/**
 * 후기 목록 페이지네이션 응답
 */
export interface ReviewListData {
  totalPages: number;
  currentPage: number;
  list: ReviewListItem[];
}

/**
 * 페이지네이션 파라미터
 */
export interface ReviewListParams {
  clientId: number;  // 필수 - 조회할 클라이언트 ID
  page: number;
  size: number;
}

/**
 * 후기 API 함수
 */
export const reviewApi = {
  /**
   * 만남 후기 작성
   */
  createReview: async (
    request: CreateReviewRequest,
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      "/client/review",
      request,
    );
    return response.data;
  },

  /**
   * 만남 후기 목록 조회 (페이지네이션)
   */
  getReviews: async (
    params: ReviewListParams,
  ): Promise<ApiResponse<ReviewListData>> => {
    const response = await apiClient.get<ApiResponse<ReviewListData>>(
      "/client/review/all",
      {
        params,
      },
    );
    return response.data;
  },
};
