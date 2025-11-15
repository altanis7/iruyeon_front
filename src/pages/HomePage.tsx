import { MainLayout } from "@/shared/components/layouts/MainLayout";

export function HomePage() {
  return (
    <MainLayout>
      <div className="p-6 pt-safe-top pt-12">
        <h1 className="text-2xl font-bold mb-4">홈</h1>
        <div className="space-y-4">메인페이지</div>
      </div>
    </MainLayout>
  );
}
