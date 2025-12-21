import { useState } from "react";
import { useNavigate } from "react-router";
import { Menu, Plus } from "lucide-react";
import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { Button } from "@/shared/components/ui/button";
import { useClients } from "@/features/profile/hooks/useClients";
import { useSearchProfiles } from "@/features/profile/hooks/useSearchProfiles";
import { ProfileGrid } from "@/features/profile/components/ProfileGrid";
import { ProfileSearchBar } from "@/features/profile/components/ProfileSearchBar";
import { ProfileDrawer } from "@/features/profile/components/ProfileDrawer";
import { ClientPagination } from "@/features/profile/components/ClientPagination";
import { mapClientToDisplay } from "@/features/profile/api/profileApi";

export function ProfilePage() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 검색 중인지 확인
  const isSearching = searchKeyword.trim().length > 0;

  // 검색 쿼리
  const { data: searchResults, isLoading: isSearchLoading } =
    useSearchProfiles({ keyword: searchKeyword });

  // 클라이언트 목록 쿼리
  const { data: clientResponse, isLoading: isClientLoading } = useClients({
    page: currentPage,
    size: pageSize,
  });

  // 검색 중이면 검색 결과, 아니면 클라이언트 목록
  const clients = clientResponse?.data.list.map(mapClientToDisplay) || [];
  const totalPages = clientResponse?.data.totalPages || 1;
  const profiles = isSearching ? searchResults : clients;
  const isLoading = isSearching ? isSearchLoading : isClientLoading;

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
        <ProfileGrid profiles={profiles || []} isLoading={isLoading} />

        {/* 페이지네이션 (검색 중이 아닐 때만 표시) */}
        {!isSearching && !isLoading && clients.length > 0 && (
          <ClientPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* 햄버거 메뉴 드로어 */}
      <ProfileDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </MainLayout>
  );
}
