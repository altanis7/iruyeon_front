import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientManagementApi } from "../api/profileApi";
import type { ClientStatus } from "../api/profileApi";

/**
 * 클라이언트 상태 변경 Hook
 *
 * @returns React Query mutation (toggleClientStatus)
 */
export function useToggleClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      status,
    }: {
      memberId: number;
      status: ClientStatus;
    }) => clientManagementApi.toggleClientStatus(memberId, status),
    onSuccess: response => {
      // 응답 body가 null일 수 있으므로 방어적으로 처리
      if (response.data?.clientId) {
        queryClient.invalidateQueries({
          queryKey: ["client", String(response.data.clientId)],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["client"] });
      }

      queryClient.invalidateQueries({ queryKey: ["myClients"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });

      const newStatus =
        response.data?.newStatus === "ACTIVE" ? "활동" : "비활동";
      toast.success(`프로필이 ${newStatus} 상태로 변경되었습니다.`);
    },
    onError: error => {
      console.error("Status toggle failed:", error);
      toast.error(error.message || "상태 변경에 실패했습니다.");
    },
  });
}
