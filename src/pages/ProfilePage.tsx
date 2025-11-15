import { useState } from "react";
import { useNavigate } from "react-router";
import { Menu, Plus } from "lucide-react";
import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { Button } from "@/shared/components/ui/button";
import { useProfiles } from "@/features/profile/hooks/useProfiles";
import { useSearchProfiles } from "@/features/profile/hooks/useSearchProfiles";
import { ProfileGrid } from "@/features/profile/components/ProfileGrid";
import { ProfileSearchBar } from "@/features/profile/components/ProfileSearchBar";
import { ProfileDrawer } from "@/features/profile/components/ProfileDrawer";

export function ProfilePage() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 검색어가 있으면 검색 쿼리 사용, 없으면 전체 목록 쿼리 사용
  const { data: allProfiles, isLoading: isLoadingAll } = useProfiles();
  const { data: searchResults, isLoading: isSearching } = useSearchProfiles({
    keyword: searchKeyword,
  });

  // 검색어 여부에 따라 적절한 데이터와 로딩 상태 선택
  const profiles = searchKeyword ? searchResults : allProfiles;
  const isLoading = searchKeyword ? isSearching : isLoadingAll;

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
      </div>

      {/* 햄버거 메뉴 드로어 */}
      <ProfileDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </MainLayout>
  );
}
