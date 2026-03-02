import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateAlarmSetting,
  type UpdateAlarmSettingRequest,
  type AlarmSetting,
} from "@/features/setting/api/alarmApi";

export function useUpdateAlarmSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAlarmSettingRequest) => updateAlarmSetting(data),
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: ["alarmSetting"] });
      const previousSettings = queryClient.getQueryData<AlarmSetting>([
        "alarmSetting",
      ]);
      queryClient.setQueryData(["alarmSetting"], newSettings);
      return { previousSettings };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alarmSetting"],
      });
      toast.success("알림 설정이 변경되었습니다.");
    },
    onError: (_, __, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(["alarmSetting"], context.previousSettings);
      }
      toast.error("알림 설정 변경에 실패했습니다.");
    },
  });
}
