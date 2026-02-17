import { useMutation } from "@tanstack/react-query";
import { uploadImageAPI } from "@/features/upload/api/uploadApi";
import type { UploadResponse } from "@/features/upload/api/uploadApi";

/**
 * 이미지 업로드 mutation hook
 * TanStack Query를 사용한 S3 이미지 업로드 API 호출
 */
export const useUploadImage = () => {
  return useMutation<UploadResponse, Error, File>({
    mutationFn: uploadImageAPI,
  });
};
