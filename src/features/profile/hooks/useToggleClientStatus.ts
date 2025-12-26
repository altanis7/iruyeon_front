import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientManagementApi } from "../api/profileApi";

/**
 * 클라이언트 상태 토글 Hook
 *
 * @returns React Query mutation (toggleClientStatus)
 */
export function useToggleClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) =>
      clientManagementApi.toggleClientStatus(memberId),
    onSuccess: response => {
      // Invalidate client detail query
      queryClient.invalidateQueries({
        queryKey: ["client", String(response.data.clientId)],
      });

      // Invalidate my clients list
      queryClient.invalidateQueries({
        queryKey: ["myClients"],
      });

      // Invalidate general clients list
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
    },
    onError: error => {
      console.error("Status toggle failed:", error);
    },
  });
}
