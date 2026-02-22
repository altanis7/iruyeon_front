import { useState } from "react";
import type { AdminMember } from "@/features/admin/api/adminApi";
import { PendingMemberTable } from "@/features/admin/components/PendingMemberTable";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import {
  usePendingMembers,
  useApproveMember,
  useRejectMember,
} from "@/features/admin/hooks/usePendingMembers";

type DialogType = "approve" | "reject" | null;

export function PendingManagersPage() {
  const { data, isLoading, isError } = usePendingMembers();
  const approveMutation = useApproveMember();
  const rejectMutation = useRejectMember();

  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);
  const [dialogType, setDialogType] = useState<DialogType>(null);

  const handleApproveClick = (member: AdminMember) => {
    setSelectedMember(member);
    setDialogType("approve");
  };

  const handleRejectClick = (member: AdminMember) => {
    setSelectedMember(member);
    setDialogType("reject");
  };

  const handleConfirm = () => {
    if (!selectedMember) return;

    const mutation = dialogType === "approve" ? approveMutation : rejectMutation;
    mutation.mutate(selectedMember.id, {
      onSuccess: () => {
        setDialogType(null);
        setSelectedMember(null);
      },
    });
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setDialogType(null);
      setSelectedMember(null);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">승인 대기중 명단</h1>
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-500">로딩중...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">승인 대기중 명단</h1>
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
        </div>
      </div>
    );
  }

  const members = data?.data.list ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">승인 대기중 명단</h1>

      {members.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-500">승인 대기중인 매니저가 없습니다.</div>
        </div>
      ) : (
        <PendingMemberTable
          members={members}
          onApprove={handleApproveClick}
          onReject={handleRejectClick}
        />
      )}

      <ConfirmDialog
        open={dialogType === "approve"}
        onOpenChange={handleDialogClose}
        title="해당 매니저를 승인하시겠습니까?"
        confirmLabel="승인"
        confirmVariant="approve"
        onConfirm={handleConfirm}
        isLoading={approveMutation.isPending}
      />

      <ConfirmDialog
        open={dialogType === "reject"}
        onOpenChange={handleDialogClose}
        title="해당 매니저를 거부하시겠습니까?"
        confirmLabel="거부"
        confirmVariant="reject"
        onConfirm={handleConfirm}
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}
