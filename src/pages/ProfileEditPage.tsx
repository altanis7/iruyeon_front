import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import RootLayout from "@/shared/components/layouts/RootLayout";
import { Button } from "@/shared/components/ui/button";
import { useClientInfo } from "@/features/profile/hooks/useClientInfo";
import { ProfileCreateForm } from "@/features/profile/components/ProfileCreateForm";
import { clientDetailToFormData } from "@/features/profile/utils/clientDetailToFormData";

/**
 * 프로필 수정 페이지
 * - 기존 데이터를 pre-fill하여 수정 폼 렌더링
 */
export function ProfileEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading } = useClientInfo(id!);

  const client = response?.data;

  // 로딩 상태
  if (isLoading) {
    return (
      <RootLayout>
        <div className="sticky top-0 bg-white z-10 px-4 pt-safe-top pt-3 pb-3 border-b">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">프로필 수정</h1>
            <div className="w-9" />
          </div>
        </div>
        <div className="p-6 pt-safe-top pt-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-32 bg-gray-200 rounded w-full" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </RootLayout>
    );
  }

  // 데이터 없음
  if (!client) {
    return (
      <RootLayout>
        <div className="sticky top-0 bg-white z-10 px-4 pt-safe-top pt-3 pb-3 border-b">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">프로필 수정</h1>
            <div className="w-9" />
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">고객 정보를 찾을 수 없습니다</p>
            <Button onClick={() => navigate("/profile")}>
              프로필 관리로 돌아가기
            </Button>
          </div>
        </div>
      </RootLayout>
    );
  }

  const formData = clientDetailToFormData(client);

  return (
    <RootLayout>
      {/* 헤더 */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-safe-top pt-3 pb-3 border-b">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/client/${id}?source=profile`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">프로필 수정</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* 수정 폼 */}
      <ProfileCreateForm
        mode="edit"
        defaultValues={formData}
        initialImageUrls={client.profileImages}
        clientId={Number(id)}
        onSuccess={() => navigate(`/client/${id}?source=profile`)}
      />
    </RootLayout>
  );
}
