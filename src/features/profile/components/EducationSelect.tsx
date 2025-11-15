/**
 * 학력 선택 컴포넌트 (2단계 선택)
 * 1단계: 학력 티어 선택
 * 2단계: 해당 티어의 구체적 학교 선택
 */
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { ProfileSelectDialog } from "./ProfileSelectDialog";
import { EDUCATION_TIERS, EDUCATION_SCHOOLS } from "../constants/profileOptions";

interface EducationSelectProps {
  educationTier: string;
  school: string;
  onEducationTierChange: (tier: string) => void;
  onSchoolChange: (school: string) => void;
  required?: boolean;
}

export function EducationSelect({
  educationTier,
  school,
  onEducationTierChange,
  onSchoolChange,
  required = false,
}: EducationSelectProps) {
  const [isTierDialogOpen, setIsTierDialogOpen] = useState(false);
  const [isSchoolDialogOpen, setIsSchoolDialogOpen] = useState(false);

  // 학력 티어가 변경되면 학교 선택 초기화
  useEffect(() => {
    if (educationTier && school) {
      const availableSchools = EDUCATION_SCHOOLS[educationTier] || [];
      if (!availableSchools.includes(school)) {
        onSchoolChange("");
      }
    }
  }, [educationTier, school, onSchoolChange]);

  const handleTierConfirm = (values: string[]) => {
    if (values.length > 0) {
      onEducationTierChange(values[0]);
      onSchoolChange(""); // 학력 티어 변경 시 학교 선택 초기화
    }
    setIsTierDialogOpen(false);
  };

  const handleSchoolConfirm = (values: string[]) => {
    if (values.length > 0) {
      onSchoolChange(values[0]);
    }
    setIsSchoolDialogOpen(false);
  };

  const availableSchools = educationTier
    ? EDUCATION_SCHOOLS[educationTier] || []
    : [];

  return (
    <div className="space-y-4">
      {/* 학력 티어 선택 */}
      <div>
        <Label>
          학력{required && <span className="text-red-500"> *</span>}
        </Label>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start mt-2"
          onClick={() => setIsTierDialogOpen(true)}
        >
          {educationTier || "학력을 선택하세요"}
        </Button>
      </div>

      {/* 학교 선택 (학력 티어 선택 후 활성화) */}
      {educationTier && (
        <div>
          <Label>학교 선택</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start mt-2"
            onClick={() => setIsSchoolDialogOpen(true)}
          >
            {school || "학교를 선택하세요"}
          </Button>
        </div>
      )}

      {/* 학력 티어 선택 다이얼로그 */}
      <ProfileSelectDialog
        open={isTierDialogOpen}
        onOpenChange={setIsTierDialogOpen}
        title="학력 선택"
        options={[...EDUCATION_TIERS]}
        selectedValues={educationTier ? [educationTier] : []}
        onConfirm={handleTierConfirm}
        multiSelect={false}
      />

      {/* 학교 선택 다이얼로그 */}
      <ProfileSelectDialog
        open={isSchoolDialogOpen}
        onOpenChange={setIsSchoolDialogOpen}
        title="학교 선택"
        options={[...availableSchools]}
        selectedValues={school ? [school] : []}
        onConfirm={handleSchoolConfirm}
        multiSelect={false}
      />
    </div>
  );
}
