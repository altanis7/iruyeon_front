import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import RootLayout from "@/shared/components/layouts/RootLayout";
import { ProfileCreateForm } from "@/features/profile/components/ProfileCreateForm";

/**
 * 프로필 등록 페이지
 */
export function ProfileNewPage() {
  const navigate = useNavigate();

  return (
    <RootLayout>
      {/* 헤더 */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-safe-top pt-3 pb-3 border-b">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">프로필 등록</h1>
          <div className="w-9" /> {/* 균형을 위한 빈 공간 */}
        </div>
      </div>

      {/* 본문 - 프로필 등록 폼 */}
      <ProfileCreateForm />
    </RootLayout>
  );
}
