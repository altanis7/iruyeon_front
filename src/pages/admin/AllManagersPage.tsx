import { useAdminMembers } from "@/features/admin/hooks/useAdminMembers";
import { MemberTable } from "@/features/admin/components/MemberTable";

export function AllManagersPage() {
  const { data, isLoading, error } = useAdminMembers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  const members = data?.data.list ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">모든 매니저</h1>
      {members.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-500">등록된 매니저가 없습니다.</div>
        </div>
      ) : (
        <MemberTable members={members} />
      )}
    </div>
  );
}
