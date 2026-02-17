/**
 * 가족 구성원 관리 섹션 컴포넌트 (기획서 기준)
 * 최대 10명까지 추가 가능
 */
import { FamilyMemberForm } from "./FamilyMemberForm";
import type { FamilyMember } from "../api/profileApi";

interface FamilyMembersSectionProps {
  familyMembers: FamilyMember[];
  onFamilyMembersChange: (members: FamilyMember[]) => void;
}

const MAX_FAMILY_MEMBERS = 10;

// 가족 아이콘 (3인 실루엣)
function FamilyIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className="text-gray-300"
    >
      {/* 왼쪽 사람 (작은 아이) */}
      <circle cx="12" cy="20" r="4" fill="currentColor" />
      <path
        d="M12 25c-3 0-5 2-5 4v7h10v-7c0-2-2-4-5-4z"
        fill="currentColor"
      />
      {/* 가운데 사람 (부모) */}
      <circle cx="24" cy="16" r="5" fill="currentColor" />
      <path
        d="M24 22c-4 0-6 2.5-6 5v9h12v-9c0-2.5-2-5-6-5z"
        fill="currentColor"
      />
      {/* 오른쪽 사람 (작은 아이) */}
      <circle cx="36" cy="20" r="4" fill="currentColor" />
      <path
        d="M36 25c-3 0-5 2-5 4v7h10v-7c0-2-2-4-5-4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FamilyMembersSection({
  familyMembers,
  onFamilyMembersChange,
}: FamilyMembersSectionProps) {
  const handleAddMember = () => {
    if (familyMembers.length >= MAX_FAMILY_MEMBERS) {
      return;
    }

    const newMember: FamilyMember = {
      name: "",
      relationship: "",
      job: undefined,
      birthYear: undefined,
      religion: undefined,
    };

    onFamilyMembersChange([...familyMembers, newMember]);
  };

  const handleUpdateMember = (index: number, updatedMember: FamilyMember) => {
    const newMembers = [...familyMembers];
    newMembers[index] = updatedMember;
    onFamilyMembersChange(newMembers);
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = familyMembers.filter((_, i) => i !== index);
    onFamilyMembersChange(newMembers);
  };

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-gray-900">
          가족 정보{" "}
          <span className="text-gray-400 font-normal">
            (최대 {MAX_FAMILY_MEMBERS}명)
          </span>
        </span>
        <button
          type="button"
          onClick={handleAddMember}
          disabled={familyMembers.length >= MAX_FAMILY_MEMBERS}
          className="text-primary font-medium text-sm hover:text-primary/80 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          + 추가하기
        </button>
      </div>

      {/* 빈 상태 */}
      {familyMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 bg-[#fcfdfe] border-2 border-dashed border-[#f7f8fa] rounded-xl">
          <FamilyIcon />
          <p className="mt-4 text-gray-400 text-sm">아직 등록된 정보가 없습니다.</p>
          <p className="text-gray-400 text-sm">버튼을 눌러 가족을 추가해주세요.</p>
        </div>
      )}

      {/* 가족 목록 */}
      <div className="space-y-4">
        {familyMembers.map((member, index) => (
          <FamilyMemberForm
            key={index}
            member={member}
            index={index}
            onUpdate={handleUpdateMember}
            onRemove={handleRemoveMember}
          />
        ))}
      </div>

      {familyMembers.length >= MAX_FAMILY_MEMBERS && (
        <p className="text-sm text-amber-600 text-center">
          최대 {MAX_FAMILY_MEMBERS}명까지만 등록 가능합니다.
        </p>
      )}
    </div>
  );
}
