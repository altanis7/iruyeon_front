import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, AlertCircle, LogOut, Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/features/profile/components/ConfirmDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import RootLayout from "@/shared/components/layouts/RootLayout";

export default function ApprovalPendingPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <RootLayout>
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
        {/* 시계 아이콘 */}
        <div className="mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
          <Clock className="w-10 h-10 text-white" strokeWidth={2.5} />
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          승인 대기 중입니다
        </h1>

        {/* 메시지 */}
        <div className="w-full bg-gray-50 rounded-xl p-6 text-center space-y-2 mb-4">
          <p className="text-gray-700 leading-relaxed">
            안녕하세요! 회원님의 정보를 검토하고 있습니다.
          </p>
          <p className="text-gray-700 leading-relaxed">
            관리자의 승인을 기다려주세요.
          </p>
          <p className="text-gray-700 leading-relaxed">
            승인 완료 시 전화 또는 문자로 안내됩니다.
          </p>
        </div>

        {/* 문의 섹션 */}
        <div className="w-full bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-amber-900">
                문의사항이 있으신가요?
              </p>
              <div className="space-y-1 text-sm text-amber-800">
                <p>
                  전화: <span className="font-semibold">02-514-3651</span>
                </p>
                <p className="text-xs text-amber-700">
                  운영시간: 평일 09:00 - 18:00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="w-full flex flex-col gap-3">
          <Button
            onClick={() => navigate("/pending/edit")}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold"
          >
            <Pencil className="w-4 h-4 mr-2" />
            수정하기
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowLogoutDialog(true)}
            className="w-full h-12 rounded-xl border-gray-300 text-gray-700 font-semibold"
          >
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="로그아웃"
        description="정말로 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        cancelText="닫기"
        onConfirm={logout}
        variant="destructive"
      />
    </RootLayout>
  );
}
