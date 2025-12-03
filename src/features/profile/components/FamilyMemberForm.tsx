/**
 * 단일 가족 구성원 입력 폼 컴포넌트
 */
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ProfileSelectDialog } from "./ProfileSelectDialog";
import { ProfilePickerDialog } from "./ProfilePickerDialog";
import { YearSelectDialog } from "./YearSelectDialog";
import { EducationSelect } from "./EducationSelect";
import {
  FAMILY_RELATION_OPTIONS,
  JOB_OPTIONS,
  RELIGION_OPTIONS,
} from "../constants/profileOptions";
import type { FamilyMember } from "../types/profileForm";

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
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isReligionDialogOpen, setIsReligionDialogOpen] = useState(false);

  const handleUpdate = (updates: Partial<FamilyMember>) => {
    onUpdate(index, { ...member, ...updates });
  };

  const handleRelationConfirm = (value: string) => {
    handleUpdate({
      relation: value,
      customRelation: value === "기타" ? member.customRelation : undefined,
    });
  };

  const handleYearConfirm = (year: number) => {
    handleUpdate({ birthYear: year });
    setIsYearDialogOpen(false);
  };

  const handleJobConfirm = (value: string) => {
    handleUpdate({ job: value });
  };

  const handleReligionConfirm = (value: string) => {
    handleUpdate({ religion: value });
  };

  const displayRelation = member.relation === "기타" && member.customRelation
    ? `기타 (${member.customRelation})`
    : member.relation;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>가족 #{index + 1}</span>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onRemove(index)}
          >
            삭제
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 관계 선택 */}
        <div>
          <Label>관계</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start mt-2"
            onClick={() => setIsRelationDialogOpen(true)}
          >
            {displayRelation || "관계를 선택하세요"}
          </Button>
        </div>

        {/* "기타" 선택 시 커스텀 입력 */}
        {member.relation === "기타" && (
          <div>
            <Label>관계 입력</Label>
            <Input
              type="text"
              placeholder="관계를 입력하세요 (예: 삼촌, 이모 등)"
              value={member.customRelation || ""}
              onChange={e => handleUpdate({ customRelation: e.target.value })}
              className="mt-2"
            />
          </div>
        )}

        {/* 나이 (출생년도) */}
        <div>
          <Label>나이</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start mt-2"
            onClick={() => setIsYearDialogOpen(true)}
          >
            {member.birthYear
              ? `${member.birthYear}년생 (만 ${new Date().getFullYear() - member.birthYear}세)`
              : "출생년도를 선택하세요"}
          </Button>
        </div>

        {/* 직업 */}
        <div>
          <Label>직업</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start mt-2"
            onClick={() => setIsJobDialogOpen(true)}
          >
            {member.job || "직업을 선택하세요"}
          </Button>
        </div>

        {/* 직업 세부 (현/전) */}
        <div>
          <Label>직업 세부 (현/전)</Label>
          <Input
            type="text"
            placeholder="예: 삼성전자 근무 / 전 LG전자"
            value={member.jobDetail || ""}
            onChange={e => handleUpdate({ jobDetail: e.target.value })}
            className="mt-2"
          />
        </div>

        {/* 학력 */}
        <EducationSelect
          educationTier={member.education || ""}
          school={member.school || ""}
          onEducationTierChange={education => handleUpdate({ education })}
          onSchoolChange={school => handleUpdate({ school })}
        />

        {/* 학력 세부 - 과 */}
        <div>
          <Label>학력 세부 - 과</Label>
          <Input
            type="text"
            placeholder="예: 경영학과"
            value={member.major || ""}
            onChange={e => handleUpdate({ major: e.target.value })}
            className="mt-2"
          />
        </div>

        {/* 종교 */}
        <div>
          <Label>종교</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start mt-2"
            onClick={() => setIsReligionDialogOpen(true)}
          >
            {member.religion || "종교를 선택하세요"}
          </Button>
        </div>

        {/* 기타 특이사항 */}
        <div>
          <Label>기타 특이사항</Label>
          <Textarea
            placeholder="기타 특이사항을 입력하세요"
            value={member.notes || ""}
            onChange={e => handleUpdate({ notes: e.target.value })}
            className="mt-2"
            rows={3}
          />
        </div>

        {/* 다이얼로그들 */}
        <ProfilePickerDialog
          open={isRelationDialogOpen}
          onOpenChange={setIsRelationDialogOpen}
          title="관계 선택"
          options={[...FAMILY_RELATION_OPTIONS]}
          selectedValue={member.relation || ""}
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
          open={isJobDialogOpen}
          onOpenChange={setIsJobDialogOpen}
          title="직업 선택"
          options={[...JOB_OPTIONS]}
          selectedValue={member.job || ""}
          onConfirm={handleJobConfirm}
        />

        <ProfilePickerDialog
          open={isReligionDialogOpen}
          onOpenChange={setIsReligionDialogOpen}
          title="종교 선택"
          options={[...RELIGION_OPTIONS]}
          selectedValue={member.religion || ""}
          onConfirm={handleReligionConfirm}
        />
      </CardContent>
    </Card>
  );
}
