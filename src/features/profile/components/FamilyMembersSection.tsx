/**
 * 가족 구성원 관리 섹션 컴포넌트 (기획서 기준)
 * 최대 10명까지 추가 가능
 */
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { FamilyMemberForm } from "./FamilyMemberForm";
import type { FamilyMember } from "../api/profileApi";

interface FamilyMembersSectionProps {
  familyMembers: FamilyMember[];
  onFamilyMembersChange: (members: FamilyMember[]) => void;
}

const MAX_FAMILY_MEMBERS = 10;

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          가족 정보{" "}
          <span className="text-sm text-gray-500">
            (최대 {MAX_FAMILY_MEMBERS}명)
          </span>
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddMember}
          disabled={familyMembers.length >= MAX_FAMILY_MEMBERS}
        >
          + 가족 추가
        </Button>
      </div>

      {familyMembers.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          <p>가족 정보가 없습니다.</p>
          <p className="text-sm mt-1">위 버튼을 눌러 가족을 추가해주세요.</p>
        </div>
      )}

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
