import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientManagementApi, type UpdateClientRequest } from "../api/profileApi";

/**
 * 클라이언트 수정 Hook
 *
 * @returns React Query mutation (updateClient)
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateClientRequest) =>
      clientManagementApi.updateClient(data),
    onSuccess: (_response, variables) => {
      // Invalidate specific client detail
      queryClient.invalidateQueries({
        queryKey: ["client", String(variables.clientId)],
      });

      // Invalidate my clients list
      queryClient.invalidateQueries({
        queryKey: ["myClients"],
      });

      // Invalidate general clients list
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
      toast.success("프로필이 수정되었습니다.");
    },
    onError: error => {
      console.error("Update failed:", error);
      toast.error(error.message || "프로필 수정에 실패했습니다.");
    },
  });
}
