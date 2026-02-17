import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { useClient } from "@/features/profile/hooks/useClient";
import { useClientInfo } from "@/features/profile/hooks/useClientInfo";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggleClientStatus } from "@/features/profile/hooks/useToggleClientStatus";
import { useDeleteClient } from "@/features/profile/hooks/useDeleteClient";
import { ConfirmDialog } from "@/features/profile/components/ConfirmDialog";
import {
  HeroSection,
  StickyProfileBar,
  InfoSection,
  EducationCareerSection,
  PreferenceSection,
  FamilySection,
  ManagerOpinionSection,
} from "@/features/profile/components/client-detail";

export function ClientDetailPage() {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const [searchParams] = useSearchParams();
  const isFromProfile = searchParams.get("source") === "profile";

  // 상호 배타적 API 호출: source=profile이면 /info API, 아니면 기존 API
  const { data: clientResponse, isLoading: clientLoading } = useClient(
    isFromProfile ? "" : clientId!
  );
  const { data: clientInfoResponse, isLoading: clientInfoLoading } =
    useClientInfo(isFromProfile ? clientId! : "");

  const response = isFromProfile ? clientInfoResponse : clientResponse;
  const isLoading = isFromProfile ? clientInfoLoading : clientLoading;
  const { currentUser } = useAuth();

  // Mutations
  const toggleStatusMutation = useToggleClientStatus();
  const deleteClientMutation = useDeleteClient();

  // UI State
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Sticky bar visibility state
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for sticky bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      {
        root: scrollContainerRef.current,
        threshold: 0,
        rootMargin: "-64px 0px 0px 0px",
      }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // ApiResponse wrapper에서 data 추출
  const client = response?.data;

  // 소유권 확인 (현재 로그인한 사용자의 ID와 클라이언트의 memberId가 일치하는지)
  const isOwner =
    currentUser && client && currentUser.id === String(client.memberId);

  // ===== 이벤트 핸들러 =====
  const handleToggleStatus = () => {
    setShowStatusDialog(true);
  };

  const confirmToggleStatus = () => {
    if (!client) return;
    toggleStatusMutation.mutate(client.memberId, {
      onSuccess: () => {
        setShowStatusDialog(false);
      },
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!client) return;
    deleteClientMutation.mutate(client.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        // 삭제 성공 후 프로필 목록으로 이동
        navigate("/profile");
      },
    });
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="h-dvh bg-slate-50 max-w-md mx-auto overflow-y-auto scrollbar-hide">
        <div className="h-[680px] bg-slate-200 animate-pulse" />
        <div className="px-4 py-6 space-y-4">
          <div className="h-40 bg-white rounded-3xl animate-pulse" />
          <div className="h-40 bg-white rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Not Found 상태
  if (!client) {
    return (
      <div className="h-dvh flex items-center justify-center bg-slate-50 max-w-md mx-auto">
        <div className="text-center">
          <p className="text-gray-500 mb-4">고객 정보를 찾을 수 없습니다</p>
          <Button onClick={() => navigate("/profile")}>
            프로필 관리로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="h-dvh overflow-y-auto bg-slate-50 max-w-md mx-auto scrollbar-hide"
    >
      {/* 스티키 바 */}
      <StickyProfileBar client={client} isVisible={showStickyBar} />

      {/* 히어로 섹션 */}
      <div ref={heroRef}>
        <HeroSection
          client={client}
          isOwner={!!isOwner}
          onBack={() => navigate(-1)}
          onToggleStatus={handleToggleStatus}
          onEdit={() => navigate(`/profile/${clientId}/edit?source=profile`)}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* 콘텐츠 섹션들 */}
      <div className="px-4 py-6 space-y-4 -mt-4">
        <InfoSection client={client} />
        <EducationCareerSection client={client} />
        <PreferenceSection client={client} />
        {client.families && client.families.length > 0 && (
          <FamilySection families={client.families} />
        )}
        {client.info && <ManagerOpinionSection info={client.info} />}
      </div>

      {/* 확인 다이얼로그 */}
      <ConfirmDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        title="상태 변경"
        description={`정말로 ${client.status === "ACTIVE" ? "비활동" : "활동"} 상태로 변경하시겠습니까?`}
        confirmText="변경"
        onConfirm={confirmToggleStatus}
        isLoading={toggleStatusMutation.isPending}
      />

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="고객 삭제"
        description="정말로 이 고객을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        onConfirm={confirmDelete}
        isLoading={deleteClientMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
