import { useQuery } from "@tanstack/react-query";
import { profileApi, type SearchProfileParams } from "../api/profileApi";

/**
 * 프로필 검색 Hook
 */
export function useSearchProfiles(params: SearchProfileParams) {
  return useQuery({
    queryKey: ["profiles", "search", params.keyword],
    queryFn: () => profileApi.searchProfiles(params),
  });
}
