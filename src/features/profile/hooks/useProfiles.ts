import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/profileApi";

/**
 * 프로필 목록 조회 Hook
 */
export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: profileApi.getProfiles,
  });
}
