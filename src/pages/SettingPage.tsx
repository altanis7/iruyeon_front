import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, ChevronRight } from "lucide-react";
import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { SettingMenuList } from "@/features/setting/components/SettingMenuList";
import { useMyInfo } from "@/features/member/hooks/useMyInfo";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";

export function SettingPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const memberId = currentUser?.id ?? "";
  const { data, isLoading } = useMyInfo(memberId);

  const memberData = data?.data;

  return (
    <MainLayout>
      <div className="flex flex-col min-h-full bg-gray-50">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white z-10 px-4 pt-3 pb-3 border-b">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">내 정보</h1>
            <div className="w-9" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-20">
          {/* 프로필 카드 */}
          <div
            className="bg-white mx-4 mt-4 p-4 rounded-xl cursor-pointer hover:bg-gray-50 active:bg-gray-100"
            onClick={() => navigate("/setting/profile")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                    {memberData?.memberImage ? (
                      <img
                        src={memberData.memberImage}
                        alt="프로필"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-100">
                        <span className="text-2xl">👤</span>
                      </div>
                    )}
                  </div>
                  {/* 인증 배지 */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {isLoading ? "로딩 중..." : memberData?.name || "이름 없음"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {memberData?.company || "회사 정보 없음"}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* 메뉴 리스트 */}
          <div className="mt-4">
            <SettingMenuList />
          </div>

          {/* 로그아웃 버튼 */}
          <div className="px-4 mt-8">
            <Button
              variant="outline"
              className="w-full py-6 rounded-full bg-red-500 border-red-500 text-white hover:bg-red-600 hover:text-white font-medium"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
