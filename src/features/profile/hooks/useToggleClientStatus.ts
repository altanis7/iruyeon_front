import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
      const newStatus = response.data.newStatus === "ACTIVE" ? "활성화" : "비활성화";
      toast.success(`프로필이 ${newStatus}되었습니다.`);
    },
    onError: error => {
      console.error("Status toggle failed:", error);
      toast.error(error.message || "상태 변경에 실패했습니다.");
    },
  });
}
