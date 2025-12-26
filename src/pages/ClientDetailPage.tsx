import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useClient } from "@/features/profile/hooks/useClient";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggleClientStatus } from "@/features/profile/hooks/useToggleClientStatus";
import { useDeleteClient } from "@/features/profile/hooks/useDeleteClient";
import { ConfirmDialog } from "@/features/profile/components/ConfirmDialog";
import RootLayout from "@/shared/components/layouts/RootLayout";
import {
  formatValue,
  formatHeight,
  formatPreferredAge,
  formatJobInfo,
  formatFamilyJob,
  formatBirthYear,
} from "@/features/profile/utils/clientFormat";

export function ClientDetailPage() {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const { data: response, isLoading } = useClient(clientId!);
  const { currentUser } = useAuth();

  // Mutations
  const toggleStatusMutation = useToggleClientStatus();
  const deleteClientMutation = useDeleteClient();

  // UI State
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      <RootLayout>
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

  // Not Found 상태
  if (!client) {
    return (
      <RootLayout>
        <div className="p-6 pt-safe-top pt-12">
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
          <h1 className="text-lg font-semibold">고객 상세</h1>
          <div className="w-9" /> {/* 균형을 위한 빈 공간 */}
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="p-6 space-y-6">
        {/* 프로필 사진 (최대 3개) */}
        {client.profileImages && client.profileImages.length > 0 ? (
          <div className="flex justify-center gap-3">
            {client.profileImages.slice(0, 3).map((image, index) => (
              <Avatar key={index} className="h-24 w-24">
                <AvatarImage src={image} alt={`${client.name} ${index + 1}`} />
                <AvatarFallback>{client.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            <Avatar className="h-32 w-32">
              <AvatarFallback className="text-3xl">
                {client.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* 관리 버튼 (소유자만 표시) */}
        {isOwner && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleStatus}
              className="flex-1 gap-2"
            >
              {client.status === "ACTIVE" ? (
                <>
                  <ToggleRight className="h-4 w-4" />
                  비활동으로 전환
                </>
              ) : (
                <>
                  <ToggleLeft className="h-4 w-4" />
                  활동으로 전환
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                /* TODO: 수정 기능 구현 */
                alert("수정 기능은 추후 구현 예정입니다.");
              }}
              className="flex-1 gap-2"
            >
              <Edit className="h-4 w-4" />
              수정
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteClick}
              className="flex-1 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </Button>
          </div>
        )}

        {/* 기본 정보 */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-base font-semibold mb-3">기본 정보</h2>

            <InfoRow label="이름" value={formatValue(client.name)} />
            <InfoRow label="성별" value={formatValue(client.gender)} />
            <InfoRow label="나이" value={formatValue(client.age)} />
            <InfoRow label="키" value={formatHeight(client.height)} />
            <InfoRow label="거주지" value={formatValue(client.address)} />
            <InfoRow label="본가" value={formatValue(client.homeTown)} />
          </CardContent>
        </Card>

        {/* 개인 정보 */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-base font-semibold mb-3">개인 정보</h2>

            <InfoRow label="종교" value={formatValue(client.religion)} />
            <InfoRow
              label="혼인상태"
              value={formatValue(client.maritalStatus)}
            />
            <InfoRow label="재산" value={formatValue(client.property)} />
            <InfoRow label="성격" value={formatValue(client.personality)} />
            <InfoRow label="취미" value={formatValue(client.hobby)} />
          </CardContent>
        </Card>

        {/* 학력 및 경력 */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-base font-semibold mb-3">학력 및 경력</h2>

            <InfoRow label="학력" value={formatValue(client.eduLevel)} />
            <InfoRow label="고등학교" value={formatValue(client.highSchool)} />
            <InfoRow label="대학교" value={formatValue(client.university)} />
            <InfoRow label="전공" value={formatValue(client.major)} />
            <InfoRow
              label="직업"
              value={formatJobInfo(client.job, client.jobDetail)}
            />
            {client.previousJob && (
              <InfoRow
                label="이전 직업"
                value={formatValue(client.previousJob)}
              />
            )}
          </CardContent>
        </Card>

        {/* 희망 조건 */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-base font-semibold mb-3">희망 조건</h2>

            <InfoRow
              label="희망 나이"
              value={formatPreferredAge(
                client.minPreferredAge,
                client.maxPreferredAge,
              )}
            />
            <InfoRow label="이상형" value={formatValue(client.idealType)} />
          </CardContent>
        </Card>

        {/* 가족 정보 */}
        {client.families && client.families.length > 0 && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-base font-semibold mb-3">가족 정보</h2>

              {client.families.map((family, index) => (
                <div
                  key={index}
                  className="border-l-2 border-gray-200 pl-4 space-y-3"
                >
                  <h3 className="text-sm font-medium text-gray-700">
                    {family.relationship}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <InfoRow
                      label="이름"
                      value={formatValue(family.name)}
                      small
                    />
                    <InfoRow
                      label="출생년도"
                      value={formatBirthYear(family.birthYear)}
                      small
                    />
                    <InfoRow
                      label="거주지"
                      value={formatValue(family.address)}
                      small
                    />
                    <InfoRow
                      label="직업"
                      value={formatFamilyJob(family.job, family.jobDetail)}
                      small
                    />
                    <InfoRow
                      label="대학교"
                      value={formatValue(family.university)}
                      small
                    />
                    <InfoRow
                      label="종교"
                      value={formatValue(family.religion)}
                      small
                    />
                    <InfoRow
                      label="재산"
                      value={formatValue(family.property)}
                      small
                    />
                    {family.info && (
                      <InfoRow
                        label="기타"
                        value={formatValue(family.info)}
                        small
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 기타 특이사항 */}
        {client.info && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-base font-semibold mb-3">기타 특이사항</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {client.info}
              </p>
            </CardContent>
          </Card>
        )}
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
    </RootLayout>
  );
}

/**
 * 정보 행 컴포넌트
 */
function InfoRow({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div>
      <dt
        className={`${small ? "text-xs" : "text-sm"} font-medium text-gray-500 mb-1`}
      >
        {label}
      </dt>
      <dd className={`${small ? "text-sm" : "text-base"}`}>{value}</dd>
    </div>
  );
}
