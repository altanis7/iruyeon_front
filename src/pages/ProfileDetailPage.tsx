import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useDeleteProfile } from "@/features/profile/hooks/useDeleteProfile";
import RootLayout from "@/shared/components/layouts/RootLayout";

export function ProfileDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading } = useProfile(id!);
  const { mutate: deleteProfile } = useDeleteProfile();

  const handleDelete = () => {
    if (!profile) return;

    if (window.confirm("정말로 이 프로필을 삭제하시겠습니까?")) {
      deleteProfile(profile.id);
    }
  };

  if (isLoading) {
    return (
      <RootLayout>
        <div className="p-6 pt-safe-top pt-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-32 bg-gray-200 rounded-full w-32 mx-auto" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </RootLayout>
    );
  }

  if (!profile) {
    return (
      <RootLayout>
        <div className="p-6 pt-safe-top pt-12">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">프로필을 찾을 수 없습니다</p>
            <Button onClick={() => navigate("/profile")}>
              프로필 관리로 돌아가기
            </Button>
          </div>
        </div>
      </RootLayout>
    );
  }

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
          <h1 className="text-lg font-semibold">프로필 상세</h1>
          <div className="w-9" /> {/* 균형을 위한 빈 공간 */}
        </div>
      </div>

      {/* 프로필 내용 */}
      <div className="p-6 space-y-6">
        {/* 프로필 사진 */}
        <div className="flex justify-center">
          <Avatar className="h-32 w-32">
            <AvatarImage
              src={profile.photoUrl}
              alt={profile.name || "프로필"}
            />
            <AvatarFallback className="text-3xl">
              {profile.name ? profile.name[0] : "?"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* 프로필 정보 */}
        <div className="space-y-4">
          {profile.name && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">이름</dt>
              <dd className="text-base">{profile.name}</dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">직업</dt>
            <dd className="text-base">{profile.job}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">나이</dt>
            <dd className="text-base">{profile.age}세</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">학력</dt>
            <dd className="text-base">{profile.education}</dd>
          </div>

          {profile.region && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">지역</dt>
              <dd className="text-base">{profile.region}</dd>
            </div>
          )}

          {/* 추가 필드들 (있을 경우에만 표시) */}
          {profile.height && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">키</dt>
              <dd className="text-base">{profile.height}cm</dd>
            </div>
          )}

          {profile.weight && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">몸무게</dt>
              <dd className="text-base">{profile.weight}kg</dd>
            </div>
          )}

          {profile.religion && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">종교</dt>
              <dd className="text-base">{profile.religion}</dd>
            </div>
          )}

          {profile.marriageType && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                성혼유형
              </dt>
              <dd className="text-base">{profile.marriageType}</dd>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(`/profile/${profile.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            수정
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>
    </RootLayout>
  );
}
