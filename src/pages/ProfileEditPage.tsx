import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import RootLayout from "@/shared/components/layouts/RootLayout";
import { Button } from "@/shared/components/ui/button";

/**
 * 프로필 수정 페이지
 * - 추후 프로필 수정 폼 구현 예정
 */
export function ProfileEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <RootLayout>
      {/* 헤더 */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-safe-top pt-3 pb-3 border-b">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/profile/${id}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">프로필 수정</h1>
          <div className="w-9" /> {/* 균형을 위한 빈 공간 */}
        </div>
      </div>

      {/* 본문 */}
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">프로필 수정 폼</p>
          <p className="text-sm text-gray-400">추후 구현 예정 (ID: {id})</p>
        </div>
      </div>
    </RootLayout>
  );
}
