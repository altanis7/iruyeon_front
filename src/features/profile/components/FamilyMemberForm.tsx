/**
 * 단일 가족 구성원 입력 폼 컴포넌트 (기획서 기준 - 간소화)
 * 5개 필드: 이름, 관계, 직업, 출생년도, 종교
 */
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
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

  const handleUpdate = (updates: Partial<FamilyMember>) => {
    onUpdate(index, { ...member, ...updates });
  };

  const handleRelationConfirm = (value: string) => {
    handleUpdate({ relationShip: value });
  };

  const handleYearConfirm = (year: number) => {
    handleUpdate({ birthYear: year });
    setIsYearDialogOpen(false);
  };

  const handleReligionConfirm = (value: string) => {
    handleUpdate({ religion: value });
  };

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
        {/* 1. 이름 */}
        <div>
          <Label>이름 <span className="text-red-500">*</span></Label>
          <Input
            type="text"
            placeholder="이름을 입력하세요"
            value={member.name || ""}
            onChange={e => handleUpdate({ name: e.target.value })}
            className="mt-2"
          />
        </div>

        {/* 2. 관계 */}
        <div>
          <Label>관계 <span className="text-red-500">*</span></Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start mt-2"
            onClick={() => setIsRelationDialogOpen(true)}
          >
            {member.relationShip || "관계를 선택하세요"}
          </Button>
        </div>

        {/* 3. 직업 */}
        <div>
          <Label>직업</Label>
          <Input
            type="text"
            placeholder="직업을 입력하세요"
            value={member.job || ""}
            onChange={e => handleUpdate({ job: e.target.value })}
            className="mt-2"
          />
        </div>

        {/* 4. 나이 (출생년도) */}
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

        {/* 5. 종교 */}
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

        {/* 다이얼로그들 */}
        <ProfilePickerDialog
          open={isRelationDialogOpen}
          onOpenChange={setIsRelationDialogOpen}
          title="관계 선택"
          options={FAMILY_RELATION_OPTIONS}
          selectedValue={member.relationShip || ""}
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
      </CardContent>
    </Card>
  );
}
