/**
 * 프로필 생성 폼 (전면 개편)
 * Step 1: 회원 프로필 (16개 필드 + 가족 정보)
 * Step 2: 희망 상대 조건 (10개 필드)
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { PhotoUpload } from "./PhotoUpload";
import { ProfileSelectDialog } from "./ProfileSelectDialog";
import { ProfilePickerDialog } from "./ProfilePickerDialog";
import { YearSelectDialog } from "./YearSelectDialog";
import { EducationSelect } from "./EducationSelect";
import { FamilyMembersSection } from "./FamilyMembersSection";
import { useCreateProfile } from "../hooks/useCreateProfile";
import type { Profile } from "../api/profileApi";
import {
  JOB_OPTIONS,
  MARRIAGE_TYPE_OPTIONS,
  ASSET_OPTIONS,
  RELIGION_OPTIONS,
  HAS_CHILDREN_OPTIONS,
  EDUCATION_TIERS,
  EDUCATION_SCHOOLS,
} from "../constants/profileOptions";
import { userProfileSchema, preferredConditionsSchema } from "../schemas/profileFormSchema";
import type { UserProfileFormData, PreferredConditionsFormData } from "../schemas/profileFormSchema";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ProfileCreateForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const createProfileMutation = useCreateProfile();

  // Step 1: 회원 프로필
  const {
    watch: watchUser,
    setValue: setValueUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: errorsUser },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    mode: "onTouched",
    defaultValues: {
      photos: [],
      mainPhotoIndex: 0,
      marriageType: "",
      job: "",
      jobDetail: "",
      education: "",
      school: "",
      major: "",
      height: "",
      assets: "",
      religion: "",
      region: "",
      hobbies: "",
      characteristics: "",
      hometown: "",
      hasChildren: "",
      notes: "",
      familyMembers: [],
    },
  });

  // Step 2: 희망 상대 조건
  const {
    watch: watchPreferred,
    setValue: setValuePreferred,
    handleSubmit: handleSubmitPreferred,
  } = useForm<PreferredConditionsFormData>({
    resolver: zodResolver(preferredConditionsSchema),
    mode: "onTouched",
    defaultValues: {
      ageMin: undefined,
      ageMax: undefined,
      marriageTypes: [],
      jobs: [],
      educationTier: "",
      schools: [],
      religions: [],
      region: "",
      minHeight: "",
      assets: [],
      notes: "",
    },
  });

  // Step 1 다이얼로그 상태
  const [birthYearDialogOpen, setBirthYearDialogOpen] = useState(false);
  const [marriageTypeDialogOpen, setMarriageTypeDialogOpen] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [assetsDialogOpen, setAssetsDialogOpen] = useState(false);
  const [religionDialogOpen, setReligionDialogOpen] = useState(false);
  const [hasChildrenDialogOpen, setHasChildrenDialogOpen] = useState(false);

  // Step 2 다이얼로그 상태
  const [preferredAgeMinDialogOpen, setPreferredAgeMinDialogOpen] = useState(false);
  const [preferredAgeMaxDialogOpen, setPreferredAgeMaxDialogOpen] = useState(false);
  const [preferredMarriageTypesDialogOpen, setPreferredMarriageTypesDialogOpen] = useState(false);
  const [preferredJobsDialogOpen, setPreferredJobsDialogOpen] = useState(false);
  const [preferredEducationTierDialogOpen, setPreferredEducationTierDialogOpen] = useState(false);
  const [preferredSchoolsDialogOpen, setPreferredSchoolsDialogOpen] = useState(false);
  const [preferredReligionsDialogOpen, setPreferredReligionsDialogOpen] = useState(false);
  const [preferredAssetsDialogOpen, setPreferredAssetsDialogOpen] = useState(false);

  // Watch Step 1 필드
  const photos = watchUser("photos");
  const mainPhotoIndex = watchUser("mainPhotoIndex");
  const birthYear = watchUser("birthYear");
  const marriageType = watchUser("marriageType");
  const job = watchUser("job");
  const education = watchUser("education");
  const school = watchUser("school");
  const assets = watchUser("assets");
  const religion = watchUser("religion");
  const hasChildren = watchUser("hasChildren");
  const familyMembers = watchUser("familyMembers");

  // Watch Step 2 필드
  const preferredAgeMin = watchPreferred("ageMin");
  const preferredAgeMax = watchPreferred("ageMax");
  const preferredMarriageTypes = watchPreferred("marriageTypes");
  const preferredJobs = watchPreferred("jobs");
  const preferredEducationTier = watchPreferred("educationTier");
  const preferredSchools = watchPreferred("schools");
  const preferredReligions = watchPreferred("religions");
  const preferredAssets = watchPreferred("assets");

  // Step 1 유효성 검사 및 다음 단계로
  const handleNextStep = () => {
    handleSubmitUser(() => {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    })();
  };

  // Step 2 제출 (최종)
  const handleFinalSubmit = () => {
    handleSubmitPreferred((preferredData) => {
      handleSubmitUser((userData) => {
        // Profile 타입에 맞게 데이터 변환
        const profileData: Omit<Profile, "id"> = {
          photos: userData.photos,
          mainPhotoIndex: userData.mainPhotoIndex,
          birthYear: userData.birthYear,
          marriageType: userData.marriageType,
          job: userData.job,
          jobDetail: userData.jobDetail,
          education: userData.education,
          school: userData.school,
          major: userData.major,
          height: userData.height,
          assets: userData.assets,
          religion: userData.religion,
          region: userData.region,
          hobbies: userData.hobbies,
          characteristics: userData.characteristics,
          hometown: userData.hometown,
          hasChildren: userData.hasChildren,
          notes: userData.notes,
          familyMembers: userData.familyMembers,
          preferredAgeMin: preferredData.ageMin,
          preferredAgeMax: preferredData.ageMax,
          preferredMarriageTypes: preferredData.marriageTypes,
          preferredJobs: preferredData.jobs,
          preferredEducationTier: preferredData.educationTier,
          preferredSchools: preferredData.schools,
          preferredReligions: preferredData.religions,
          preferredRegion: preferredData.region,
          preferredMinHeight: preferredData.minHeight,
          preferredAssets: preferredData.assets,
          preferredNotes: preferredData.notes,
        };

        createProfileMutation.mutate(profileData);
      })();
    })();
  };

  // 이전 버튼 핸들러
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 희망 학교 옵션 (선택된 학력 티어 기반)
  const availablePreferredSchools = preferredEducationTier
    ? EDUCATION_SCHOOLS[preferredEducationTier] || []
    : [];

  // 학력 티어가 변경되면 학교 선택 초기화
  const handlePreferredEducationTierChange = (tier: string) => {
    setValuePreferred("educationTier", tier);
    setValuePreferred("schools", []); // 티어 변경 시 학교 선택 초기화
  };

  return (
    <div className="p-6">
      {/* 스텝 인디케이터 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep} / {totalSteps}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: 회원 프로필 */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">회원 프로필</h2>

          {/* 사진 업로드 */}
          <div className="space-y-2">
            <Label>프로필 사진 <span className="text-red-500">*</span></Label>
            <PhotoUpload
              photos={photos || []}
              mainPhotoIndex={mainPhotoIndex || 0}
              onPhotosChange={newPhotos => setValueUser("photos", newPhotos)}
              onMainPhotoChange={index => setValueUser("mainPhotoIndex", index)}
            />
            {errorsUser.photos && (
              <p className="text-sm text-red-500">{errorsUser.photos.message}</p>
            )}
          </div>

          {/* 1. 나이 (출생년도) */}
          <div className="space-y-2">
            <Label>나이 <span className="text-red-500">*</span></Label>
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
            {errorsUser.birthYear && (
              <p className="text-sm text-red-500">{errorsUser.birthYear.message}</p>
            )}
          </div>

          {/* 2. 성혼유형 */}
          <div className="space-y-2">
            <Label>성혼유형 <span className="text-red-500">*</span></Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setMarriageTypeDialogOpen(true)}
            >
              {marriageType || "성혼유형을 선택하세요"}
            </Button>
            {errorsUser.marriageType && (
              <p className="text-sm text-red-500">{errorsUser.marriageType.message}</p>
            )}
          </div>

          {/* 3. 직업 */}
          <div className="space-y-2">
            <Label>직업 <span className="text-red-500">*</span></Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setJobDialogOpen(true)}
            >
              {job || "직업을 선택하세요"}
            </Button>
            {errorsUser.job && (
              <p className="text-sm text-red-500">{errorsUser.job.message}</p>
            )}
          </div>

          {/* 4. 직업 세부 (현/전) */}
          <div className="space-y-2">
            <Label>직업 세부 (현/전)</Label>
            <Input
              placeholder="예: 현) 삼성전자, 전) LG전자"
              value={watchUser("jobDetail") || ""}
              onChange={e => setValueUser("jobDetail", e.target.value)}
            />
          </div>

          {/* 5-6. 학력 */}
          <EducationSelect
            educationTier={education}
            school={school || ""}
            onEducationTierChange={tier => setValueUser("education", tier)}
            onSchoolChange={sch => setValueUser("school", sch)}
            required
          />

          {/* 6. 학력 세부 - 과 */}
          <div className="space-y-2">
            <Label>학력 세부 - 과</Label>
            <Input
              placeholder="예: 경영학과"
              value={watchUser("major") || ""}
              onChange={e => setValueUser("major", e.target.value)}
            />
          </div>

          {/* 7. 키 */}
          <div className="space-y-2">
            <Label>키</Label>
            <div className="relative">
              <Input
                placeholder="키를 입력하세요"
                value={watchUser("height") || ""}
                onChange={e => setValueUser("height", e.target.value)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                cm
              </span>
            </div>
          </div>

          {/* 8. 재산 */}
          <div className="space-y-2">
            <Label>재산 <span className="text-red-500">*</span></Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setAssetsDialogOpen(true)}
            >
              {assets || "재산을 선택하세요"}
            </Button>
            {errorsUser.assets && (
              <p className="text-sm text-red-500">{errorsUser.assets.message}</p>
            )}
          </div>

          {/* 9. 종교 */}
          <div className="space-y-2">
            <Label>종교 <span className="text-red-500">*</span></Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setReligionDialogOpen(true)}
            >
              {religion || "종교를 선택하세요"}
            </Button>
            {errorsUser.religion && (
              <p className="text-sm text-red-500">{errorsUser.religion.message}</p>
            )}
          </div>

          {/* 10. 지역 */}
          <div className="space-y-2">
            <Label>지역</Label>
            <Input
              placeholder="예: 서울 강남구"
              value={watchUser("region") || ""}
              onChange={e => setValueUser("region", e.target.value)}
            />
          </div>

          {/* 11. 취미 */}
          <div className="space-y-2">
            <Label>취미</Label>
            <Input
              placeholder="예: 등산, 독서"
              value={watchUser("hobbies") || ""}
              onChange={e => setValueUser("hobbies", e.target.value)}
            />
          </div>

          {/* 12. 특징 */}
          <div className="space-y-2">
            <Label>특징</Label>
            <Input
              placeholder="예: 활발한 성격"
              value={watchUser("characteristics") || ""}
              onChange={e => setValueUser("characteristics", e.target.value)}
            />
          </div>

          {/* 13. 본가 */}
          <div className="space-y-2">
            <Label>본가</Label>
            <Input
              placeholder="예: 경기도 수원시"
              value={watchUser("hometown") || ""}
              onChange={e => setValueUser("hometown", e.target.value)}
            />
          </div>

          {/* 14. 아이 유무 */}
          <div className="space-y-2">
            <Label>아이 유무 <span className="text-red-500">*</span></Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setHasChildrenDialogOpen(true)}
            >
              {hasChildren || "아이 유무를 선택하세요"}
            </Button>
            {errorsUser.hasChildren && (
              <p className="text-sm text-red-500">{errorsUser.hasChildren.message}</p>
            )}
          </div>

          {/* 15. 기타 특이사항 */}
          <div className="space-y-2">
            <Label>기타 특이사항</Label>
            <Textarea
              placeholder="기타 특이사항을 입력하세요"
              value={watchUser("notes") || ""}
              onChange={e => setValueUser("notes", e.target.value)}
              rows={4}
            />
          </div>

          {/* 16. 가족 정보 */}
          <FamilyMembersSection
            familyMembers={familyMembers}
            onFamilyMembersChange={members => setValueUser("familyMembers", members)}
          />
        </div>
      )}

      {/* Step 2: 희망 상대 조건 */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">희망 상대 조건</h2>

          {/* 1. 나이 (이상) */}
          <div className="space-y-2">
            <Label>나이 (이상)</Label>
            <Button
              type="button"
              variant="outline"
              className={cn("w-full justify-start", !preferredAgeMin && "text-muted-foreground")}
              onClick={() => setPreferredAgeMinDialogOpen(true)}
            >
              {preferredAgeMin
                ? `${preferredAgeMin}년생 (만 ${new Date().getFullYear() - preferredAgeMin}세 이상)`
                : "최소 나이를 선택하세요"}
            </Button>
          </div>

          {/* 1. 나이 (이하) */}
          <div className="space-y-2">
            <Label>나이 (이하)</Label>
            <Button
              type="button"
              variant="outline"
              className={cn("w-full justify-start", !preferredAgeMax && "text-muted-foreground")}
              onClick={() => setPreferredAgeMaxDialogOpen(true)}
            >
              {preferredAgeMax
                ? `${preferredAgeMax}년생 (만 ${new Date().getFullYear() - preferredAgeMax}세 이하)`
                : "최대 나이를 선택하세요"}
            </Button>
          </div>

          {/* 2. 성혼유형 */}
          <div className="space-y-2">
            <Label>성혼유형</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setPreferredMarriageTypesDialogOpen(true)}
            >
              {preferredMarriageTypes && preferredMarriageTypes.length > 0
                ? preferredMarriageTypes.join(", ")
                : "성혼유형을 선택하세요"}
            </Button>
          </div>

          {/* 3. 직업 */}
          <div className="space-y-2">
            <Label>직업</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setPreferredJobsDialogOpen(true)}
            >
              {preferredJobs && preferredJobs.length > 0
                ? preferredJobs.join(", ")
                : "직업을 선택하세요"}
            </Button>
          </div>

          {/* 4. 학력 (이상) */}
          <div className="space-y-2">
            <Label>학력 (이상)</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setPreferredEducationTierDialogOpen(true)}
            >
              {preferredEducationTier ? `${preferredEducationTier} 이상` : "학력을 선택하세요"}
            </Button>
          </div>

          {/* 5. 학교 */}
          {preferredEducationTier && (
            <div className="space-y-2">
              <Label>학교</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => setPreferredSchoolsDialogOpen(true)}
              >
                {preferredSchools && preferredSchools.length > 0
                  ? preferredSchools.join(", ")
                  : "학교를 선택하세요"}
              </Button>
            </div>
          )}

          {/* 6. 종교 */}
          <div className="space-y-2">
            <Label>종교</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setPreferredReligionsDialogOpen(true)}
            >
              {preferredReligions && preferredReligions.length > 0
                ? preferredReligions.join(", ")
                : "종교를 선택하세요"}
            </Button>
          </div>

          {/* 7. 지역 */}
          <div className="space-y-2">
            <Label>지역</Label>
            <Input
              placeholder="예: 서울"
              value={watchPreferred("region") || ""}
              onChange={e => setValuePreferred("region", e.target.value)}
            />
          </div>

          {/* 8. 키 (이상) */}
          <div className="space-y-2">
            <Label>키 (이상)</Label>
            <div className="relative">
              <Input
                placeholder="최소 키를 입력하세요"
                value={watchPreferred("minHeight") || ""}
                onChange={e => setValuePreferred("minHeight", e.target.value)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                cm
              </span>
            </div>
          </div>

          {/* 9. 재산 */}
          <div className="space-y-2">
            <Label>재산</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setPreferredAssetsDialogOpen(true)}
            >
              {preferredAssets && preferredAssets.length > 0
                ? preferredAssets.join(", ")
                : "재산을 선택하세요"}
            </Button>
          </div>

          {/* 10. 기타 특이사항 */}
          <div className="space-y-2">
            <Label>기타 특이사항</Label>
            <Textarea
              placeholder="희망 상대 기타 특이사항을 입력하세요"
              value={watchPreferred("notes") || ""}
              onChange={e => setValuePreferred("notes", e.target.value)}
              rows={4}
            />
          </div>
        </div>
      )}

      {/* 네비게이션 버튼 */}
      <div className="flex gap-3 pt-4 border-t mt-6">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handlePrevious}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            이전
          </Button>
        )}

        {currentStep < totalSteps ? (
          <Button
            type="button"
            className="flex-1"
            onClick={handleNextStep}
          >
            다음
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1"
            size="lg"
            onClick={handleFinalSubmit}
            disabled={createProfileMutation.isPending}
          >
            {createProfileMutation.isPending ? "등록 중..." : "등록 완료"}
          </Button>
        )}
      </div>

      {/* ===== Step 1 다이얼로그들 ===== */}
      <YearSelectDialog
        open={birthYearDialogOpen}
        onOpenChange={setBirthYearDialogOpen}
        title="출생년도 선택"
        selectedYear={birthYear}
        onConfirm={year => {
          setValueUser("birthYear", year);
          setBirthYearDialogOpen(false);
        }}
      />

      <ProfilePickerDialog
        open={marriageTypeDialogOpen}
        onOpenChange={setMarriageTypeDialogOpen}
        title="성혼유형 선택"
        options={[...MARRIAGE_TYPE_OPTIONS]}
        selectedValue={marriageType || ""}
        onConfirm={value => {
          setValueUser("marriageType", value);
        }}
      />

      <ProfilePickerDialog
        open={jobDialogOpen}
        onOpenChange={setJobDialogOpen}
        title="직업 선택"
        options={[...JOB_OPTIONS]}
        selectedValue={job || ""}
        onConfirm={value => {
          setValueUser("job", value);
        }}
      />

      <ProfilePickerDialog
        open={assetsDialogOpen}
        onOpenChange={setAssetsDialogOpen}
        title="재산 선택"
        options={[...ASSET_OPTIONS]}
        selectedValue={assets || ""}
        onConfirm={value => {
          setValueUser("assets", value);
        }}
      />

      <ProfilePickerDialog
        open={religionDialogOpen}
        onOpenChange={setReligionDialogOpen}
        title="종교 선택"
        options={[...RELIGION_OPTIONS]}
        selectedValue={religion || ""}
        onConfirm={value => {
          setValueUser("religion", value);
        }}
      />

      <ProfilePickerDialog
        open={hasChildrenDialogOpen}
        onOpenChange={setHasChildrenDialogOpen}
        title="아이 유무 선택"
        options={[...HAS_CHILDREN_OPTIONS]}
        selectedValue={hasChildren || ""}
        onConfirm={value => {
          setValueUser("hasChildren", value);
        }}
      />

      {/* ===== Step 2 다이얼로그들 ===== */}
      <YearSelectDialog
        open={preferredAgeMinDialogOpen}
        onOpenChange={setPreferredAgeMinDialogOpen}
        title="희망 나이 (이상) 선택"
        selectedYear={preferredAgeMin}
        onConfirm={year => {
          setValuePreferred("ageMin", year);
          setPreferredAgeMinDialogOpen(false);
        }}
      />

      <YearSelectDialog
        open={preferredAgeMaxDialogOpen}
        onOpenChange={setPreferredAgeMaxDialogOpen}
        title="희망 나이 (이하) 선택"
        selectedYear={preferredAgeMax}
        onConfirm={year => {
          setValuePreferred("ageMax", year);
          setPreferredAgeMaxDialogOpen(false);
        }}
      />

      <ProfileSelectDialog
        open={preferredMarriageTypesDialogOpen}
        onOpenChange={setPreferredMarriageTypesDialogOpen}
        title="희망 성혼유형 선택"
        options={[...MARRIAGE_TYPE_OPTIONS]}
        selectedValues={preferredMarriageTypes || []}
        onConfirm={values => {
          setValuePreferred("marriageTypes", values);
          setPreferredMarriageTypesDialogOpen(false);
        }}
        multiSelect={true}
      />

      <ProfileSelectDialog
        open={preferredJobsDialogOpen}
        onOpenChange={setPreferredJobsDialogOpen}
        title="희망 직업 선택"
        options={[...JOB_OPTIONS]}
        selectedValues={preferredJobs || []}
        onConfirm={values => {
          setValuePreferred("jobs", values);
          setPreferredJobsDialogOpen(false);
        }}
        multiSelect={true}
      />

      <ProfileSelectDialog
        open={preferredReligionsDialogOpen}
        onOpenChange={setPreferredReligionsDialogOpen}
        title="희망 종교 선택"
        options={[...RELIGION_OPTIONS]}
        selectedValues={preferredReligions || []}
        onConfirm={values => {
          setValuePreferred("religions", values);
          setPreferredReligionsDialogOpen(false);
        }}
        multiSelect={true}
      />

      <ProfileSelectDialog
        open={preferredAssetsDialogOpen}
        onOpenChange={setPreferredAssetsDialogOpen}
        title="희망 재산 선택"
        options={[...ASSET_OPTIONS]}
        selectedValues={preferredAssets || []}
        onConfirm={values => {
          setValuePreferred("assets", values);
          setPreferredAssetsDialogOpen(false);
        }}
        multiSelect={true}
      />

      <ProfilePickerDialog
        open={preferredEducationTierDialogOpen}
        onOpenChange={setPreferredEducationTierDialogOpen}
        title="희망 학력 (이상) 선택"
        options={[...EDUCATION_TIERS]}
        selectedValue={preferredEducationTier || ""}
        onConfirm={value => {
          handlePreferredEducationTierChange(value);
        }}
      />

      <ProfileSelectDialog
        open={preferredSchoolsDialogOpen}
        onOpenChange={setPreferredSchoolsDialogOpen}
        title="희망 학교 선택"
        options={[...availablePreferredSchools]}
        selectedValues={preferredSchools || []}
        onConfirm={values => {
          setValuePreferred("schools", values);
          setPreferredSchoolsDialogOpen(false);
        }}
        multiSelect={true}
      />
    </div>
  );
}
