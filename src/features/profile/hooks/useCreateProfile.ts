/**
 * 프로필 생성 Mutation Hook
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { profileApi, type Profile } from "../api/profileApi";

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (profile: Omit<Profile, "id">) =>
      profileApi.createProfile(profile),
    onSuccess: () => {
      // 프로필 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["profiles"] });

      // 성공 토스트
      // toast({
      //   title: "프로필 생성 완료",
      //   description: "프로필이 성공적으로 생성되었습니다.",
      // });

      // 프로필 목록 페이지로 이동
      navigate("/profile");
    },
    onError: (error: Error) => {
      // 실패 토스트
      // toast({
      //   variant: "destructive",
      //   title: "프로필 생성 실패",
      //   description: error.message || "프로필 생성 중 오류가 발생했습니다.",
      // });
    },
  });
}
