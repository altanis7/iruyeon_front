import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  notificationApi,
  NotificationSettings,
} from "../api/notificationApi";

export const useNotificationSettings = () => {
  return useQuery({
    queryKey: ["notificationSettings"],
    queryFn: notificationApi.getNotificationSettings,
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.updateNotificationSettings,
    onMutate: async (newSettings) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notificationSettings"] });

      // Snapshot previous value
      const previousSettings = queryClient.getQueryData([
        "notificationSettings",
      ]);

      // Optimistically update
      queryClient.setQueryData(["notificationSettings"], (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          ...newSettings,
        },
      }));

      return { previousSettings };
    },
    onError: (err, newSettings, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["notificationSettings"],
        context?.previousSettings
      );
      toast.error("알림 설정 변경에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
    },
  });
};
