import { useQuery } from "@tanstack/react-query";
import { matchApi } from "../api/matchApi";

/**
 * 매칭 알림 개수를 조회하는 Hook
 *
 * @returns React Query 결과 (data는 ApiResponse<MatchAlarmData> 형태)
 */
export function useMatchAlarm() {
  return useQuery({
    queryKey: ["matches", "alarm"],
    queryFn: () => matchApi.getMatchAlarm(),
    staleTime: 30 * 1000, // 30초간 fresh 유지 (알림은 자주 변경될 수 있음)
  });
}
