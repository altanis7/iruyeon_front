import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Menu, Plus } from "lucide-react";
import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { Button } from "@/shared/components/ui/button";
import { useClients } from "@/features/profile/hooks/useClients";
import { useSearchClients } from "@/features/profile/hooks/useSearchClients";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProfileGrid } from "@/features/profile/components/ProfileGrid";
import { ProfileSearchBar } from "@/features/profile/components/ProfileSearchBar";
import { ProfileDrawer } from "@/features/profile/components/ProfileDrawer";
import {
  mapClientToDisplay,
  type ClientDisplayData,
} from "@/features/profile/api/profileApi";
import { MatchRequestDialog } from "@/features/match/components/MatchRequestDialog";

export function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<ClientDisplayData | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 검색 중인지 확인
  const isSearching = searchKeyword.trim().length > 0;

  // 검색 쿼리
  const { data: searchResponse, isLoading: isSearchLoading } =
    useSearchClients({ keyword: searchKeyword });

  // 클라이언트 목록 쿼리 (인피니티)
  const {
    data,
    isLoading: isClientLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useClients();

  // 모든 페이지의 클라이언트 데이터를 평탄화
  const clients =
    data?.pages.flatMap(page =>
      page.data.list.map(mapClientToDisplay),
    ) || [];

  const profiles = isSearching ? (searchResponse?.data.list.map(mapClientToDisplay) || []) : clients;
  const isLoading = isSearching ? isSearchLoading : isClientLoading;

  const handleMatchRequest = (profile: ClientDisplayData) => {
    setSelectedProfile(profile);
    setMatchDialogOpen(true);
  };

  // Intersection Observer 설정 (검색 중이 아닐 때만)
  useEffect(() => {
    if (isSearching) return;

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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isSearching]);

  return (
    <MainLayout>
      {/* 헤더 */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-safe-top pt-3 pb-3 border-b">
        <div className="flex items-center gap-3">
          {/* 햄버거 메뉴 */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* 검색바 */}
          <ProfileSearchBar
            value={searchKeyword}
            onChange={setSearchKeyword}
          />

          {/* 프로필등록 버튼 */}
          <Button
            variant="default"
            size="sm"
            className="shrink-0 h-9"
            onClick={() => navigate("/profile/new")}
          >
            <Plus className="h-4 w-4 mr-1" />
            프로필등록
          </Button>
        </div>
      </div>

      {/* 프로필 그리드 */}
      <div className="p-4 pb-6">
        <ProfileGrid
          profiles={profiles || []}
          isLoading={isLoading}
          currentUserId={currentUser?.id ? Number(currentUser.id) : undefined}
          onMatchRequest={handleMatchRequest}
        />

        {/* 인피니티 스크롤 트리거 (검색 중이 아닐 때만) */}
        {!isSearching && hasNextPage && (
          <div ref={loadMoreRef} className="h-10 flex items-center justify-center mt-4">
            {isFetchingNextPage && (
              <div className="text-sm text-gray-500">로딩 중...</div>
            )}
          </div>
        )}
      </div>

      {/* 햄버거 메뉴 드로어 */}
      <ProfileDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />

      {/* 매칭 신청 다이얼로그 */}
      {selectedProfile && (
        <MatchRequestDialog
          open={matchDialogOpen}
          onOpenChange={setMatchDialogOpen}
          toClientId={Number(selectedProfile.id)}
          toClientName={selectedProfile.name}
          onSuccess={() => {
            setMatchDialogOpen(false);
            setSelectedProfile(null);
          }}
        />
      )}
    </MainLayout>
  );
}
