import { MainLayout } from "@/shared/components/layouts/MainLayout";
export function ProfilePage() {
  return (
    <MainLayout>
      <div className="p-6 pt-safe-top pt-12">
        <h1 className="text-2xl font-bold mb-6">프로필</h1>
        <div className="space-y-4">프로필관리</div>
      </div>
    </MainLayout>
  );
}
