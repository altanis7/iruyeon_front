import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profileApi";
import { useNavigate } from "react-router";

/**
 * 프로필 삭제 Hook
 */
export function useDeleteProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: profileApi.deleteProfile,
    onSuccess: () => {
      // 프로필 목록 쿼리 무효화 (refetch)
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      // 프로필 관리 페이지로 이동
      navigate("/profile");
    },
  });
}
