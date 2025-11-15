import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/profileApi";

/**
 * 프로필 상세 조회 Hook
 */
export function useProfile(id: string) {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => profileApi.getProfileById(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
}
