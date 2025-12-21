/**
 * 학력 선택 컴포넌트 (기획서 기준)
 * - 학력 수준 선택 (고졸/학사/석사/박사/전문대)
 */
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { ProfilePickerDialog } from "./ProfilePickerDialog";
import { EDUCATION_LEVELS } from "../constants/profileOptions";
import { cn } from "@/lib/utils";

interface EducationSelectProps {
  value: string; // eduLevel
  onChange: (level: string) => void;
  required?: boolean;
  className?: string;
}

export function EducationSelect({
  value,
  onChange,
  required = false,
  className,
}: EducationSelectProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirm = (level: string) => {
    onChange(level);
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        className={cn("w-full justify-start", !value && "text-muted-foreground")}
        onClick={() => setIsDialogOpen(true)}
      >
        {value || "학력을 선택하세요"}
      </Button>

      <ProfilePickerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="학력 선택"
        options={[...EDUCATION_LEVELS]}
        selectedValue={value || ""}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
