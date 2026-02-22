import { apiClient } from "@/lib/api/client";
import axios from "axios";

// ========== 타입 정의 ==========

export interface UploadResponse {
  data: {
    imageIds: number[];
    imageUrls: string[];
  };
  status: number;
  message: string;
  responseTime: string;
}

// ========== API 함수 ==========

/**
 * S3 이미지 업로드 API
 * @param file 업로드할 파일
 * @returns 업로드된 이미지 ID와 URL
 */
export const uploadImageAPI = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<UploadResponse>(
      "/s3/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "이미지 업로드에 실패했습니다.";
      throw new Error(message);
    }
    throw error;
  }
};
