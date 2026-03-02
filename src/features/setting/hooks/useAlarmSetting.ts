import { useQuery } from "@tanstack/react-query";
import { getAlarmSetting } from "@/features/setting/api/alarmApi";

export function useAlarmSetting() {
  return useQuery({
    queryKey: ["alarmSetting"],
    queryFn: () => getAlarmSetting(),
  });
}
