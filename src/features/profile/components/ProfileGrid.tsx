import { useNavigate } from "react-router";
import { ProfileCard } from "./ProfileCard";
import type { ClientDisplayData } from "../api/profileApi";

interface ProfileGridProps {
  profiles: ClientDisplayData[];
  isLoading?: boolean;
}

/**
 * 프로필 그리드 컴포넌트
 * - 2열 그리드 레이아웃 (모바일 최적화)
 * - 6개씩 보이고 스크롤 가능
 */
export function ProfileGrid({ profiles, isLoading }: ProfileGridProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[320px] bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 mb-2">등록된 프로필이 없습니다</p>
        <p className="text-sm text-gray-400">
          프로필등록 버튼을 눌러 새 프로필을 만들어보세요
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onClick={() => navigate(`/client/${profile.id}`)}
        />
      ))}
    </div>
  );
}
