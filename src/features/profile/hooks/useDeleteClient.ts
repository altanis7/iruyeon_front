import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientManagementApi } from "../api/profileApi";

/**
 * 클라이언트 삭제 Hook
 *
 * @returns React Query mutation (deleteClient)
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: number) =>
      clientManagementApi.deleteClient(clientId),
    onSuccess: (_, clientId) => {
      // Remove specific client from cache
      queryClient.removeQueries({
        queryKey: ["client", String(clientId)],
      });

      // Invalidate my clients list
      queryClient.invalidateQueries({
        queryKey: ["myClients"],
      });

      // Invalidate general clients list
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
      toast.success("프로필이 삭제되었습니다.");
    },
    onError: error => {
      console.error("Delete failed:", error);
      toast.error(error.message || "프로필 삭제에 실패했습니다.");
    },
  });
}
