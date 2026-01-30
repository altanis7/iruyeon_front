/**
 * 프로필 생성 폼 (전면 개편 - 단일 Step)
 * 기획서 기준: 24개 필드 단일 페이지 스크롤
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { ProfilePickerDialog } from "./ProfilePickerDialog";
import { YearSelectDialog } from "./YearSelectDialog";
import { EducationSelect } from "./EducationSelect";
import { FamilyMembersSection } from "./FamilyMembersSection";
import { KeywordSelector } from "./KeywordSelector";
import { PropertyInput } from "./PropertyInput";
import { HeightInputDialog } from "./HeightInputDialog";
import { AgeRangeInput } from "./AgeRangeInput";
import { useCreateClient } from "../hooks/useCreateClient";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { convertFormDataToUpdateRequest } from "../utils/formDataToUpdateRequest";
import { profileSchema } from "../schemas/profileFormSchema";
import type { ProfileFormData } from "../schemas/profileFormSchema";
import {
  GENDER_OPTIONS,
  JOB_OPTIONS,
  RELIGION_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PERSONALITY_KEYWORDS,
} from "../constants/profileOptions";
import { cn } from "@/lib/utils";

interface ProfileCreateFormProps {
  mode?: 'create' | 'edit';
  defaultValues?: ProfileFormData;
  clientId?: number;
  onSuccess?: () => void;
}

export function ProfileCreateForm({
  mode = 'create',
  defaultValues: externalDefaults,
  clientId,
  onSuccess,
}: ProfileCreateFormProps = {}) {
  const createProfileMutation = useCreateClient();
  const updateMutation = useUpdateClient();

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    defaultValues: externalDefaults ?? {
      imageIdList: [],
      name: "",
      phoneNumber: "",
      gender: "",
      birthYear: undefined,
      address: "",
      eduLevel: "",
      university: "",
      highSchool: "",
      major: "",
      job: "",
      jobDetail: "",
      previousJob: "",
      height: undefined,
      religion: "",
      property: "",
      hobby: "",
      personality: "",
      idealType: "",
      maritalStatus: "",
      homeTown: "",
      info: "",
      minPreferredAge: undefined,
      maxPreferredAge: undefined,
      family: [],
    },
  });

  // 다이얼로그 상태
  const [genderDialogOpen, setGenderDialogOpen] = useState(false);
  const [birthYearDialogOpen, setBirthYearDialogOpen] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [heightDialogOpen, setHeightDialogOpen] = useState(false);
  const [religionDialogOpen, setReligionDialogOpen] = useState(false);
  const [maritalStatusDialogOpen, setMaritalStatusDialogOpen] = useState(false);

  // Watch 필드
  const gender = watch("gender");
  const birthYear = watch("birthYear");
  const job = watch("job");
  const eduLevel = watch("eduLevel");
  const height = watch("height");
  const religion = watch("religion");
  const maritalStatus = watch("maritalStatus");
  const personality = watch("personality");
  const idealType = watch("idealType");
  const family = watch("family");

  // 성격/이상형: 문자열 → 배열 변환
  const personalityArray = personality ? personality.split(", ").filter(Boolean) : [];
  const idealTypeArray = idealType ? idealType.split(", ").filter(Boolean) : [];

  // 성격/이상형 업데이트 핸들러
  const handlePersonalityChange = (selected: string[]) => {
    setValue("personality", selected.join(", "));
  };

  const handleIdealTypeChange = (selected: string[]) => {
    setValue("idealType", selected.join(", "));
  };

  // 최종 제출
  const onSubmit = (data: ProfileFormData) => {
    if (mode === 'edit' && clientId) {
      const updateRequest = convertFormDataToUpdateRequest(data, clientId);
      updateMutation.mutate(updateRequest, {
        onSuccess: () => onSuccess?.(),
      });
    } else {
      createProfileMutation.mutate(data);
    }
  };

  const isPending = mode === 'create' ? createProfileMutation.isPending : updateMutation.isPending;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-bold mb-4">{mode === 'create' ? '프로필 등록' : '프로필 수정'}</h2>

        {/* 1. 프로필 사진 (PhotoUpload는 나중에 추가) */}
        <div className="space-y-2">
          <Label>프로필 사진</Label>
          <div className="p-4 border-2 border-dashed rounded-lg text-center text-muted-foreground">
            사진 업로드 기능은 추후 구현 예정입니다
          </div>
        </div>

        {/* 2. 이름 */}
        <div className="space-y-2">
          <Label>이름 <span className="text-red-500">*</span></Label>
          <Input
            placeholder="이름을 입력하세요"
            value={watch("name")}
            onChange={e => setValue("name", e.target.value)}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* 3. 전화번호 */}
        <div className="space-y-2">
          <Label>전화번호 <span className="text-red-500">*</span></Label>
          <Input
            placeholder="01012345678"
            value={watch("phoneNumber")}
            onChange={e => setValue("phoneNumber", e.target.value)}
          />
          {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
        </div>

        {/* 4. 성별 */}
        <div className="space-y-2">
          <Label>성별 <span className="text-red-500">*</span></Label>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start", !gender && "text-muted-foreground")}
            onClick={() => setGenderDialogOpen(true)}
          >
            {gender || "성별을 선택하세요"}
          </Button>
          {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
        </div>

        {/* 5. 출생년도 */}
        <div className="space-y-2">
          <Label>출생년도 <span className="text-red-500">*</span></Label>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start", !birthYear && "text-muted-foreground")}
            onClick={() => setBirthYearDialogOpen(true)}
          >
            {birthYear
              ? `${birthYear}년생 (만 ${new Date().getFullYear() - birthYear}세)`
              : "출생년도를 선택하세요"}
          </Button>
          {errors.birthYear && <p className="text-sm text-red-500">{errors.birthYear.message}</p>}
        </div>

        {/* 6. 직업 */}
        <div className="space-y-2">
          <Label>직업 <span className="text-red-500">*</span></Label>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start", !job && "text-muted-foreground")}
            onClick={() => setJobDialogOpen(true)}
          >
            {job || "직업을 선택하세요"}
          </Button>
          {errors.job && <p className="text-sm text-red-500">{errors.job.message}</p>}
        </div>

        {/* 7. 직업 상세 */}
        <div className="space-y-2">
          <Label>직업 상세</Label>
          <Input
            placeholder="예: 삼성전자"
            value={watch("jobDetail") || ""}
            onChange={e => setValue("jobDetail", e.target.value)}
          />
        </div>

        {/* 8. 이전 직업 */}
        <div className="space-y-2">
          <Label>이전 직업</Label>
          <Input
            placeholder="예: LG전자"
            value={watch("previousJob") || ""}
            onChange={e => setValue("previousJob", e.target.value)}
          />
        </div>

        {/* 9. 학력 */}
        <div className="space-y-2">
          <Label>학력 <span className="text-red-500">*</span></Label>
          <EducationSelect
            value={eduLevel}
            onChange={level => setValue("eduLevel", level)}
            required
          />
          {errors.eduLevel && <p className="text-sm text-red-500">{errors.eduLevel.message}</p>}
        </div>

        {/* 10. 대학교명 */}
        <div className="space-y-2">
          <Label>대학교명</Label>
          <Input
            placeholder="예: 성균관대학교"
            value={watch("university") || ""}
            onChange={e => setValue("university", e.target.value)}
          />
        </div>

        {/* 11. 고등학교 */}
        <div className="space-y-2">
          <Label>고등학교</Label>
          <Input
            placeholder="예: 휘문고등학교"
            value={watch("highSchool") || ""}
            onChange={e => setValue("highSchool", e.target.value)}
          />
        </div>

        {/* 12. 전공 */}
        <div className="space-y-2">
          <Label>전공</Label>
          <Input
            placeholder="예: 물리학과"
            value={watch("major") || ""}
            onChange={e => setValue("major", e.target.value)}
          />
        </div>

        {/* 13. 키 */}
        <div className="space-y-2">
          <Label>키 <span className="text-red-500">*</span></Label>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start", !height && "text-muted-foreground")}
            onClick={() => setHeightDialogOpen(true)}
          >
            {height ? `${height}cm` : "키를 입력하세요"}
          </Button>
          {errors.height && <p className="text-sm text-red-500">{errors.height.message}</p>}
        </div>

        {/* 14. 거주지 */}
        <div className="space-y-2">
          <Label>거주지 <span className="text-red-500">*</span></Label>
          <Input
            placeholder="예: 서울특별시 마포구"
            value={watch("address")}
            onChange={e => setValue("address", e.target.value)}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
        </div>

        {/* 15. 재산 */}
        <div className="space-y-2">
          <Label>재산</Label>
          <PropertyInput
            value={watch("property") || ""}
            onChange={value => setValue("property", value)}
          />
        </div>

        {/* 16. 종교 */}
        <div className="space-y-2">
          <Label>종교 <span className="text-red-500">*</span></Label>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start", !religion && "text-muted-foreground")}
            onClick={() => setReligionDialogOpen(true)}
          >
            {religion || "종교를 선택하세요"}
          </Button>
          {errors.religion && <p className="text-sm text-red-500">{errors.religion.message}</p>}
        </div>

        {/* 17. 취미 */}
        <div className="space-y-2">
          <Label>취미</Label>
          <Input
            placeholder="예: 러닝, 헬스"
            value={watch("hobby") || ""}
            onChange={e => setValue("hobby", e.target.value)}
          />
        </div>

        {/* 18. 성격 */}
        <div className="space-y-2">
          <Label>성격</Label>
          <KeywordSelector
            keywords={PERSONALITY_KEYWORDS}
            selectedKeywords={personalityArray}
            onSelectionChange={handlePersonalityChange}
          />
        </div>

        {/* 19. 이상형 */}
        <div className="space-y-2">
          <Label>이상형</Label>
          <KeywordSelector
            keywords={PERSONALITY_KEYWORDS}
            selectedKeywords={idealTypeArray}
            onSelectionChange={handleIdealTypeChange}
          />
        </div>

        {/* 20. 원하는 상대 나이 */}
        <div className="space-y-2">
          <Label>원하는 상대 나이</Label>
          <AgeRangeInput
            minAge={watch("minPreferredAge")}
            maxAge={watch("maxPreferredAge")}
            onMinChange={year => setValue("minPreferredAge", year)}
            onMaxChange={year => setValue("maxPreferredAge", year)}
          />
        </div>

        {/* 21. 혼인 여부 */}
        <div className="space-y-2">
          <Label>혼인 여부 <span className="text-red-500">*</span></Label>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start", !maritalStatus && "text-muted-foreground")}
            onClick={() => setMaritalStatusDialogOpen(true)}
          >
            {maritalStatus || "혼인 여부를 선택하세요"}
          </Button>
          {errors.maritalStatus && <p className="text-sm text-red-500">{errors.maritalStatus.message}</p>}
        </div>

        {/* 22. 본가 */}
        <div className="space-y-2">
          <Label>본가</Label>
          <Input
            placeholder="예: 서울"
            value={watch("homeTown") || ""}
            onChange={e => setValue("homeTown", e.target.value)}
          />
        </div>

        {/* 23. 기타 특이사항 */}
        <div className="space-y-2">
          <Label>기타 특이사항 (최대 100자)</Label>
          <Textarea
            placeholder="기타 특이사항을 입력하세요"
            value={watch("info") || ""}
            onChange={e => setValue("info", e.target.value)}
            rows={4}
            maxLength={100}
          />
          {errors.info && <p className="text-sm text-red-500">{errors.info.message}</p>}
        </div>

        {/* 24. 가족 정보 */}
        <FamilyMembersSection
          familyMembers={family || []}
          onFamilyMembersChange={members => setValue("family", members)}
        />

        {/* 등록 완료 버튼 */}
        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {isPending
              ? (mode === 'create' ? "등록 중..." : "수정 중...")
              : (mode === 'create' ? "등록 완료" : "수정 완료")}
          </Button>
        </div>
      </form>

      {/* ===== 다이얼로그들 ===== */}
      <ProfilePickerDialog
        open={genderDialogOpen}
        onOpenChange={setGenderDialogOpen}
        title="성별 선택"
        options={GENDER_OPTIONS}
        selectedValue={gender || ""}
        onConfirm={value => setValue("gender", value)}
      />

      <YearSelectDialog
        open={birthYearDialogOpen}
        onOpenChange={setBirthYearDialogOpen}
        title="출생년도 선택"
        selectedYear={birthYear}
        onConfirm={year => {
          setValue("birthYear", year);
          setBirthYearDialogOpen(false);
        }}
      />

      <ProfilePickerDialog
        open={jobDialogOpen}
        onOpenChange={setJobDialogOpen}
        title="직업 선택"
        options={JOB_OPTIONS}
        selectedValue={job || ""}
        onConfirm={value => setValue("job", value)}
      />

      <HeightInputDialog
        open={heightDialogOpen}
        onOpenChange={setHeightDialogOpen}
        title="키 입력"
        value={height}
        onConfirm={h => setValue("height", h)}
      />

      <ProfilePickerDialog
        open={religionDialogOpen}
        onOpenChange={setReligionDialogOpen}
        title="종교 선택"
        options={RELIGION_OPTIONS}
        selectedValue={religion || ""}
        onConfirm={value => setValue("religion", value)}
      />

      <ProfilePickerDialog
        open={maritalStatusDialogOpen}
        onOpenChange={setMaritalStatusDialogOpen}
        title="혼인 여부 선택"
        options={MARITAL_STATUS_OPTIONS}
        selectedValue={maritalStatus || ""}
        onConfirm={value => setValue("maritalStatus", value)}
      />
    </div>
  );
}
