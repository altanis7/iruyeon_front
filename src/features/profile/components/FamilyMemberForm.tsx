/**
 * 단일 가족 구성원 입력 폼 컴포넌트 (기획서 기준)
 * 11개 필드: 이름, 관계, 전화번호, 직업, 출생년도, 종교, 직업 상세, 거주지, 대학교, 재산, 기타 정보
 */
import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingLabelInput } from "./FloatingLabelInput";
import { FloatingLabelSelect } from "./FloatingLabelSelect";
import { ProfilePickerDialog } from "./ProfilePickerDialog";
import { YearSelectDialog } from "./YearSelectDialog";
import {
  FAMILY_RELATION_OPTIONS,
  RELIGION_OPTIONS,
} from "../constants/profileOptions";
import type { FamilyMember } from "../api/profileApi";

interface FamilyMemberFormProps {
  member: FamilyMember;
  index: number;
  onUpdate: (index: number, member: FamilyMember) => void;
  onRemove: (index: number) => void;
}

export function FamilyMemberForm({
  member,
  index,
  onUpdate,
  onRemove,
}: FamilyMemberFormProps) {
  const [isRelationDialogOpen, setIsRelationDialogOpen] = useState(false);
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const [isReligionDialogOpen, setIsReligionDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleUpdate = (updates: Partial<FamilyMember>) => {
    onUpdate(index, { ...member, ...updates });
  };

  const handleRelationConfirm = (value: string) => {
    handleUpdate({ relationship: value });
  };

  const handleYearConfirm = (year: number) => {
    handleUpdate({ birthYear: year });
    setIsYearDialogOpen(false);
  };

  const handleReligionConfirm = (value: string) => {
    handleUpdate({ religion: value });
  };

  // 가족 정보 요약 텍스트
  const getSummaryText = () => {
    const parts = [];
    if (member.relationship) parts.push(member.relationship);
    if (member.name) parts.push(member.name);
    return parts.length > 0 ? parts.join(" · ") : `가족 #${index + 1}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-medium text-gray-900">{getSummaryText()}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDetailOpen(!isDetailOpen)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isDetailOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 기본 정보 (항상 표시) */}
      <div className="p-4 space-y-4">
        {/* 1. 이름 */}
        <FloatingLabelInput
          label="이름"
          value={member.name || ""}
          onChange={value => handleUpdate({ name: value })}
          placeholder="이름을 입력하세요"
          required
        />

        {/* 2. 관계 */}
        <FloatingLabelSelect
          label="관계"
          value={member.relationship}
          onClick={() => setIsRelationDialogOpen(true)}
          placeholder="관계를 선택하세요"
          required
        />

        {/* 3. 전화번호 */}
        <FloatingLabelInput
          label="전화번호"
          value={member.phoneNumber || ""}
          onChange={value => handleUpdate({ phoneNumber: value })}
          placeholder="01012345678"
          type="tel"
        />

        {/* 4. 직업 */}
        <FloatingLabelInput
          label="직업"
          value={member.job || ""}
          onChange={value => handleUpdate({ job: value })}
          placeholder="직업을 입력하세요"
        />

        {/* 5. 나이 (출생년도) */}
        <FloatingLabelSelect
          label="나이"
          value={member.birthYear}
          displayValue={
            member.birthYear
              ? `${member.birthYear}년생 (만 ${new Date().getFullYear() - member.birthYear}세)`
              : ""
          }
          onClick={() => setIsYearDialogOpen(true)}
          placeholder="출생년도를 선택하세요"
        />

        {/* 6. 종교 */}
        <FloatingLabelSelect
          label="종교"
          value={member.religion}
          onClick={() => setIsReligionDialogOpen(true)}
          placeholder="종교를 선택하세요"
        />
      </div>

      {/* 상세 정보 (접기/펼치기) */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isDetailOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 font-medium">상세 정보</p>

          {/* 7. 직업 상세 */}
          <FloatingLabelInput
            label="직업 상세"
            value={member.jobDetail || ""}
            onChange={value => handleUpdate({ jobDetail: value })}
            placeholder="예: 삼성전자"
          />

          {/* 8. 거주지 */}
          <FloatingLabelInput
            label="거주지"
            value={member.address || ""}
            onChange={value => handleUpdate({ address: value })}
            placeholder="거주지를 입력하세요"
          />

          {/* 9. 대학교 */}
          <FloatingLabelInput
            label="대학교"
            value={member.university || ""}
            onChange={value => handleUpdate({ university: value })}
            placeholder="대학교를 입력하세요"
          />

          {/* 10. 재산 */}
          <FloatingLabelInput
            label="재산"
            value={member.property || ""}
            onChange={value => handleUpdate({ property: value })}
            placeholder="재산 정보를 입력하세요"
          />

          {/* 11. 기타 정보 */}
          <FloatingLabelInput
            label="기타 정보"
            value={member.info || ""}
            onChange={value => handleUpdate({ info: value })}
            placeholder="기타 정보를 입력하세요"
          />
        </div>
      </div>

      {/* 다이얼로그들 */}
      <ProfilePickerDialog
        open={isRelationDialogOpen}
        onOpenChange={setIsRelationDialogOpen}
        title="관계 선택"
        options={FAMILY_RELATION_OPTIONS}
        selectedValue={member.relationship || ""}
        onConfirm={handleRelationConfirm}
      />

      <YearSelectDialog
        open={isYearDialogOpen}
        onOpenChange={setIsYearDialogOpen}
        title="출생년도 선택"
        selectedYear={member.birthYear}
        onConfirm={handleYearConfirm}
        minAge={0}
        maxAge={100}
      />

      <ProfilePickerDialog
        open={isReligionDialogOpen}
        onOpenChange={setIsReligionDialogOpen}
        title="종교 선택"
        options={RELIGION_OPTIONS}
        selectedValue={member.religion || ""}
        onConfirm={handleReligionConfirm}
      />
    </div>
  );
}
