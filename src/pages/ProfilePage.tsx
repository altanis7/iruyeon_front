import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { Button } from "@/shared/components/ui/button";
import { useMyClients } from "@/features/profile/hooks/useMyClients";
import { MyClientCard } from "@/features/profile/components/MyClientCard";
import { mapMyClientToDisplay } from "@/features/profile/api/profileApi";

export function ProfilePage() {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useMyClients();

  // 모든 페이지의 클라이언트 데이터를 평탄화
  const clients =
    data?.pages.flatMap(page =>
      page.data.list.map(mapMyClientToDisplay),
    ) || [];

  // Intersection Observer 설정
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <MainLayout>
      {/* 헤더 */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-safe-top pt-3 pb-3 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">프로필 관리</h1>

          {/* 프로필등록 버튼 */}
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/profile/new")}
          >
            <Plus className="h-4 w-4 mr-1" />
            프로필등록
          </Button>
        </div>
      </div>

      {/* 프로필 그리드 */}
      <div className="p-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[320px] bg-gray-100 rounded-lg animate-pulse"
              />
            ))
          ) : clients.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 mb-2">등록된 회원이 없습니다</p>
              <p className="text-sm text-gray-400">
                프로필등록 버튼을 눌러 새 회원을 등록해보세요
              </p>
            </div>
          ) : (
            clients.map(client => (
              <MyClientCard
                key={client.id}
                client={client}
                onClick={() => navigate(`/client/${client.id}?source=profile`)}
              />
            ))
          )}
        </div>

        {/* 인피니티 스크롤 트리거 */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
            {isFetchingNextPage && (
              <div className="text-sm text-gray-500">로딩 중...</div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
