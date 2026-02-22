/**
 * 프로필 생성 폼 (전면 개편 - 단일 Step)
 * 기획서 기준: 24개 필드 단일 페이지 스크롤
 */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { ProfilePickerDialog } from "./ProfilePickerDialog";
import { FloatingLabelInput } from "./FloatingLabelInput";
import { FloatingLabelTextarea } from "./FloatingLabelTextarea";
import { FloatingLabelSelect } from "./FloatingLabelSelect";
import { YearSelectDialog } from "./YearSelectDialog";
import { EducationSelect } from "./EducationSelect";
import { FamilyMembersSection } from "./FamilyMembersSection";
import { GenderToggle } from "./GenderToggle";
import { KeywordPickerSection } from "./KeywordPickerSection";
import { PropertyInput } from "./PropertyInput";
import { HeightInputDialog } from "./HeightInputDialog";
import { AgeRangeInput } from "./AgeRangeInput";
import { ProfilePhotoUploader } from "./ProfilePhotoUploader";
import { useCreateClient } from "../hooks/useCreateClient";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { convertFormDataToUpdateRequest } from "../utils/formDataToUpdateRequest";
import { profileSchema } from "../schemas/profileFormSchema";
import type { ProfileFormData } from "../schemas/profileFormSchema";
import {
  JOB_OPTIONS,
  RELIGION_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PERSONALITY_KEYWORDS,
} from "../constants/profileOptions";

interface ProfileCreateFormProps {
  mode?: "create" | "edit";
  defaultValues?: ProfileFormData;
  initialImageUrls?: string[];
  clientId?: number;
  onSuccess?: () => void;
}

export function ProfileCreateForm({
  mode = "create",
  defaultValues: externalDefaults,
  initialImageUrls = [],
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
  const [birthYearDialogOpen, setBirthYearDialogOpen] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [heightDialogOpen, setHeightDialogOpen] = useState(false);
  const [religionDialogOpen, setReligionDialogOpen] = useState(false);
  const [maritalStatusDialogOpen, setMaritalStatusDialogOpen] = useState(false);

  // 이미지 URL 상태 (미리보기용 - imageId는 form에, imageUrl은 로컬 상태로)
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);

  // 비동기 데이터 동기화 (React Query에서 데이터 도착 시 상태 업데이트)
  useEffect(() => {
    if (initialImageUrls.length > 0) {
      setImageUrls(initialImageUrls);
    }
  }, [initialImageUrls]);

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
  const imageIdList = watch("imageIdList") || [];

  // 이미지 변경 핸들러
  const handleImagesChange = (ids: number[], urls: string[]) => {
    setValue("imageIdList", ids);
    setImageUrls(urls);
  };

  // 성격/이상형: 문자열 → 배열 변환
  const personalityArray = personality
    ? personality.split(", ").filter(Boolean)
    : [];
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
    if (mode === "edit" && clientId) {
      const updateRequest = convertFormDataToUpdateRequest(data, clientId);
      updateMutation.mutate(updateRequest, {
        onSuccess: () => onSuccess?.(),
      });
    } else {
      createProfileMutation.mutate(data);
    }
  };

  const isPending =
    mode === "create"
      ? createProfileMutation.isPending
      : updateMutation.isPending;

  return (
    <div className="p-6 max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-bold mb-4">
          {mode === "create" ? "프로필 등록" : "프로필 수정"}
        </h2>

        {/* 1. 프로필 사진 */}
        <div className="space-y-2">
          <ProfilePhotoUploader
            imageIds={imageIdList}
            imageUrls={imageUrls}
            onImagesChange={handleImagesChange}
          />
          {errors.imageIdList && (
            <p className="text-sm text-red-500">{errors.imageIdList.message}</p>
          )}
        </div>

        {/* 2. 이름 */}
        <FloatingLabelInput
          label="이름"
          value={watch("name")}
          onChange={value => setValue("name", value)}
          required
          hasError={!!errors.name}
          errorMessage={errors.name?.message}
        />

        {/* 3. 전화번호 */}
        <FloatingLabelInput
          label="전화번호"
          value={watch("phoneNumber")}
          onChange={value => setValue("phoneNumber", value)}
          placeholder="01012345678"
          type="tel"
          required
          hasError={!!errors.phoneNumber}
          errorMessage={errors.phoneNumber?.message}
        />

        {/* 4. 성별 */}
        <GenderToggle
          value={gender}
          onChange={value => setValue("gender", value)}
          hasError={!!errors.gender}
          errorMessage={errors.gender?.message}
        />

        {/* 5. 출생년도 */}
        <FloatingLabelSelect
          label="출생년도"
          value={birthYear}
          displayValue={
            birthYear
              ? `${birthYear}년생 (만 ${new Date().getFullYear() - birthYear}세)`
              : ""
          }
          onClick={() => setBirthYearDialogOpen(true)}
          placeholder="출생년도를 선택하세요"
          required
          hasError={!!errors.birthYear}
          errorMessage={errors.birthYear?.message}
        />

        {/* 6. 직업 */}
        <FloatingLabelSelect
          label="직업"
          value={job}
          onClick={() => setJobDialogOpen(true)}
          placeholder="직업을 선택하세요"
          required
          hasError={!!errors.job}
          errorMessage={errors.job?.message}
        />

        {/* 7. 직업 상세 */}
        <FloatingLabelInput
          label="직업 상세"
          value={watch("jobDetail") || ""}
          onChange={value => setValue("jobDetail", value)}
          placeholder="예: 삼성전자"
        />

        {/* 8. 이전 직업 */}
        <FloatingLabelInput
          label="이전 직업"
          value={watch("previousJob") || ""}
          onChange={value => setValue("previousJob", value)}
          placeholder="예: LG전자"
        />

        {/* 9. 학력 */}
        <EducationSelect
          value={eduLevel}
          onChange={level => setValue("eduLevel", level)}
          required
          hasError={!!errors.eduLevel}
          errorMessage={errors.eduLevel?.message}
        />

        {/* 10. 대학교명 */}
        <FloatingLabelInput
          label="대학교명"
          value={watch("university") || ""}
          onChange={value => setValue("university", value)}
          placeholder="예: 성균관대학교"
        />

        {/* 11. 고등학교 */}
        <FloatingLabelInput
          label="고등학교"
          value={watch("highSchool") || ""}
          onChange={value => setValue("highSchool", value)}
          placeholder="예: 휘문고등학교"
        />

        {/* 12. 전공 */}
        <FloatingLabelInput
          label="전공"
          value={watch("major") || ""}
          onChange={value => setValue("major", value)}
          placeholder="예: 물리학과"
        />

        {/* 13. 키 */}
        <FloatingLabelSelect
          label="키"
          value={height}
          displayValue={height ? `${height}cm` : ""}
          onClick={() => setHeightDialogOpen(true)}
          placeholder="키를 입력하세요"
          required
          hasError={!!errors.height}
          errorMessage={errors.height?.message}
        />

        {/* 14. 거주지 */}
        <FloatingLabelInput
          label="거주지"
          value={watch("address")}
          onChange={value => setValue("address", value)}
          placeholder="예: 서울특별시 마포구"
          required
          hasError={!!errors.address}
          errorMessage={errors.address?.message}
        />

        {/* 15. 재산 */}
        <PropertyInput
          value={watch("property") || ""}
          onChange={value => setValue("property", value)}
        />

        {/* 16. 종교 */}
        <FloatingLabelSelect
          label="종교"
          value={religion}
          onClick={() => setReligionDialogOpen(true)}
          placeholder="종교를 선택하세요"
          required
          hasError={!!errors.religion}
          errorMessage={errors.religion?.message}
        />

        {/* 17. 취미 */}
        <FloatingLabelInput
          label="취미"
          value={watch("hobby") || ""}
          onChange={value => setValue("hobby", value)}
          placeholder="예: 러닝, 헬스"
        />

        {/* 18. 성격 */}
        <KeywordPickerSection
          label="성격"
          keywords={PERSONALITY_KEYWORDS}
          selectedKeywords={personalityArray}
          onSelectionChange={handlePersonalityChange}
          maxSelection={3}
          emptyText="아직 선택된 성격이 없습니다."
          emptySubText="버튼을 눌러 성격을 선택해주세요."
        />

        {/* 19. 이상형 */}
        <KeywordPickerSection
          label="이상형"
          keywords={PERSONALITY_KEYWORDS}
          selectedKeywords={idealTypeArray}
          onSelectionChange={handleIdealTypeChange}
          maxSelection={3}
          emptyText="아직 선택된 이상형이 없습니다."
          emptySubText="버튼을 눌러 이상형을 선택해주세요."
        />

        {/* 20. 원하는 상대 나이 */}
        <AgeRangeInput
          minAge={watch("minPreferredAge")}
          maxAge={watch("maxPreferredAge")}
          onMinChange={year => setValue("minPreferredAge", year)}
          onMaxChange={year => setValue("maxPreferredAge", year)}
        />

        {/* 21. 혼인 여부 */}
        <FloatingLabelSelect
          label="혼인 여부"
          value={maritalStatus}
          onClick={() => setMaritalStatusDialogOpen(true)}
          placeholder="혼인 여부를 선택하세요"
          required
          hasError={!!errors.maritalStatus}
          errorMessage={errors.maritalStatus?.message}
        />

        {/* 22. 본가 */}
        <FloatingLabelInput
          label="본가"
          value={watch("homeTown") || ""}
          onChange={value => setValue("homeTown", value)}
          placeholder="예: 서울"
        />

        {/* 23. 기타 특이사항 */}
        <FloatingLabelTextarea
          label="기타 특이사항"
          value={watch("info") || ""}
          onChange={value => setValue("info", value)}
          placeholder="기타 특이사항을 입력하세요"
          maxLength={100}
          rows={4}
          hasError={!!errors.info}
          errorMessage={errors.info?.message}
        />

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
              ? mode === "create"
                ? "등록 중..."
                : "수정 중..."
              : mode === "create"
                ? "등록 완료"
                : "수정 완료"}
          </Button>
        </div>
      </form>

      {/* ===== 다이얼로그들 ===== */}
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
