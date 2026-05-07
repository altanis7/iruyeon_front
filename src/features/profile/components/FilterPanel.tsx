import { useState, useEffect } from "react";
import { ChevronRight, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FloatingLabelInput } from "@/features/profile/components/FloatingLabelInput";
import { DualRangeSlider } from "@/shared/components/ui/dual-range-slider";
import { cn } from "@/lib/utils";
import type { FilterSearchParams } from "@/features/profile/api/profileApi";
import {
  type FilterCategory,
  FILTER_LABELS,
  FILTER_OPTIONS,
  FILTER_CATEGORY_ORDER,
  INITIAL_FILTER_STATE,
  BIRTH_YEAR_MIN,
  BIRTH_YEAR_MAX,
  HEIGHT_MIN,
  HEIGHT_MAX,
  PROFESSIONAL_SUB_OPTIONS,
  getFilterSummaryText,
  resetCategoryFilter,
} from "@/features/profile/utils/filterOptions";

interface FilterPanelProps {
  open: boolean;
  initialFilters: FilterSearchParams;
  onClose: () => void;
  onSearch: (filters: FilterSearchParams) => void;
}

// FilterCategory → FilterSearchParams 배열 필드 매핑
const categoryToField: Partial<
  Record<FilterCategory, keyof FilterSearchParams>
> = {
  job: "job",
  religion: "religion",
  gender: "gender",
  eduLevel: "eduLevel",
  universities: "universities",
  maritalStatus: "maritalStatus",
};

export function FilterPanel({
  open,
  initialFilters,
  onClose,
  onSearch,
}: FilterPanelProps) {
  const [draft, setDraft] = useState<FilterSearchParams>(initialFilters);
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory | null>(null);
  const [showProfessionalSub, setShowProfessionalSub] = useState(false);
  const [draftSnapshot, setDraftSnapshot] = useState<FilterSearchParams | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      setDraft(initialFilters);
      setSelectedCategory(null);
      setShowProfessionalSub(false);
      setDraftSnapshot(null);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const handleSearch = () => {
    onSearch(draft);
  };

  const handleResetAll = () => {
    setDraft(INITIAL_FILTER_STATE);
  };

  const handleResetCategory = (category: FilterCategory) => {
    setDraft(prev => resetCategoryFilter(category, prev));
  };

  const toggleArrayField = (field: keyof FilterSearchParams, value: string) => {
    setDraft(prev => {
      const arr = (prev[field] as string[]) ?? [];
      const updated = arr.includes(value)
        ? arr.filter(v => v !== value)
        : [...arr, value];
      return { ...prev, [field]: updated };
    });
  };

  const isDefaultSummary = (category: FilterCategory) => {
    return (
      getFilterSummaryText(category, draft) ===
      getFilterSummaryText(category, INITIAL_FILTER_STATE)
    );
  };

  // Level 1 → Level 2 진입
  const handleSelectCategory = (category: FilterCategory) => {
    setDraftSnapshot({ ...draft });
    setSelectedCategory(category);
    setShowProfessionalSub(false);
  };

  // Level 2 뒤로가기 (취소)
  const handleBackFromLevel2 = () => {
    if (draftSnapshot) setDraft(draftSnapshot);
    setSelectedCategory(null);
    setShowProfessionalSub(false);
  };

  // Level 2 선택 버튼 (확정)
  const handleConfirmLevel2 = () => {
    setSelectedCategory(null);
    setShowProfessionalSub(false);
  };

  // Level 2 → Level 3 진입 (전문직 클릭)
  const handleEnterProfessionalSub = () => {
    setDraftSnapshot({ ...draft });
    setShowProfessionalSub(true);
  };

  // Level 3 뒤로가기 (취소)
  const handleBackFromLevel3 = () => {
    if (draftSnapshot) setDraft(draftSnapshot);
    setShowProfessionalSub(false);
  };

  // Level 3 선택 버튼 (확정)
  const handleConfirmLevel3 = () => {
    setShowProfessionalSub(false);
    setSelectedCategory(null);
  };

  // ─── Level 3: 전문직 세부 선택 뷰 ──────────────────────────────────
  if (selectedCategory === "job" && showProfessionalSub) {
    const selectedJobs = (draft.job as string[]) ?? [];

    return (
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[60] bg-white flex flex-col">
        <div className="flex items-center justify-between px-4 h-14 border-b shrink-0">
          <button onClick={handleBackFromLevel3} className="p-1 -ml-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold text-base">전문직</span>
          <button
            onClick={() => handleResetCategory("job")}
            className="text-sm text-gray-500 active:text-rose-500"
          >
            삭제
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul>
            {PROFESSIONAL_SUB_OPTIONS.map(option => {
              const isSelected = selectedJobs.includes(option);
              return (
                <li key={option}>
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 border-b text-left active:bg-gray-50"
                    onClick={() => toggleArrayField("job", option)}
                  >
                    <div>
                      <span
                        className={cn(
                          "text-sm",
                          isSelected && "text-rose-500 font-medium",
                        )}
                      >
                        {option}
                      </span>
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {option === "법조계 전문직" &&
                          "판사, 검사, 변호사, 변리사"}
                        {option === "의료계 전문직" && "의사, 약사"}
                        {option === "금융계 전문직" && "회계사, 세무사"}
                        {option === "기술계 전문직" && "건축사, 기술사"}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-rose-500 shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="px-4 py-4 border-t shrink-0">
          <Button
            className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-base font-semibold"
            onClick={handleConfirmLevel3}
          >
            선택
          </Button>
        </div>
      </div>
    );
  }

  // ─── Level 2: 상세 선택 뷰 ──────────────────────────────────────────
  if (selectedCategory) {
    const field = categoryToField[selectedCategory];
    const selectedValues = field ? ((draft[field] as string[]) ?? []) : [];
    const selectedJobs = (draft.job as string[]) ?? [];
    const hasProfessionalSub = PROFESSIONAL_SUB_OPTIONS.some(opt =>
      selectedJobs.includes(opt),
    );

    return (
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[60] bg-white flex flex-col">
        <div className="flex items-center justify-between px-4 h-14 border-b shrink-0">
          <button onClick={handleBackFromLevel2} className="p-1 -ml-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold text-base">
            {FILTER_LABELS[selectedCategory]}
          </span>
          <button
            onClick={() => handleResetCategory(selectedCategory)}
            className="text-sm text-gray-500 active:text-rose-500"
          >
            삭제
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* 출생년도 범위 슬라이더 */}
          {selectedCategory === "birthYear" && (() => {
            // 값 변환 공식: 슬라이더 값과 실제 값을 반전
            // minBirthYear = 2005 (나이 어린), maxBirthYear = 1960 (나이 많은)
            // 슬라이더: 좌(1960) → 우(2005)
            // 좌측 핸들 조작 → 좌측 텍스트(minBirthYear) 변경
            // 우측 핸들 조작 → 우측 텍스트(maxBirthYear) 변경
            const BIRTH_YEAR_SUM = BIRTH_YEAR_MIN + BIRTH_YEAR_MAX; // 1960 + 2005 = 3965
            const currentYear = new Date().getFullYear();
            const minBirth = draft.minBirthYear ?? BIRTH_YEAR_MAX; // 기본 2005
            const maxBirth = draft.maxBirthYear ?? BIRTH_YEAR_MIN; // 기본 1960

            return (
              <div className="px-4 py-6">
                <p className="text-sm text-gray-500 mb-4">
                  원하는 상대방 출생년도 범위를 선택하세요
                </p>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-rose-500 font-medium">
                    {currentYear - minBirth}세({minBirth}년생) 이상
                  </span>
                  <span className="text-sm text-rose-500 font-medium">
                    {currentYear - maxBirth}세({maxBirth}년생) 이하
                  </span>
                </div>
                <DualRangeSlider
                  min={BIRTH_YEAR_MIN}
                  max={BIRTH_YEAR_MAX}
                  step={1}
                  minValue={BIRTH_YEAR_SUM - minBirth}
                  maxValue={BIRTH_YEAR_SUM - maxBirth}
                  onMinChange={v =>
                    setDraft(prev => ({ ...prev, minBirthYear: BIRTH_YEAR_SUM - v }))
                  }
                  onMaxChange={v =>
                    setDraft(prev => ({ ...prev, maxBirthYear: BIRTH_YEAR_SUM - v }))
                  }
                  unit="년"
                />
              </div>
            );
          })()}

          {/* 키 범위 슬라이더 */}
          {selectedCategory === "height" && (
            <div className="px-4 py-6">
              <p className="text-sm text-gray-500 mb-4">
                원하는 상대방 키 범위를 선택하세요
              </p>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-rose-500 font-medium">
                  {draft.minHeight ?? HEIGHT_MIN}cm 이상
                </span>
                <span className="text-sm text-rose-500 font-medium">
                  {draft.maxHeight ?? HEIGHT_MAX}cm 이하
                </span>
              </div>
              <DualRangeSlider
                min={HEIGHT_MIN}
                max={HEIGHT_MAX}
                step={1}
                minValue={draft.minHeight ?? HEIGHT_MIN}
                maxValue={draft.maxHeight ?? HEIGHT_MAX}
                onMinChange={v => setDraft(prev => ({ ...prev, minHeight: v }))}
                onMaxChange={v => setDraft(prev => ({ ...prev, maxHeight: v }))}
                unit="cm"
              />
            </div>
          )}

          {/* 키워드 입력 */}
          {selectedCategory === "keyword" && (
            <div className="px-4 py-6 space-y-3">
              <p className="text-sm text-gray-500">예: 의사, 여행, 강아지</p>
              <FloatingLabelInput
                label="키워드 입력"
                value={draft.keyword ?? ""}
                onChange={v => setDraft(prev => ({ ...prev, keyword: v }))}
                placeholder="키워드를 입력하세요"
              />
            </div>
          )}

          {/* 체크마크 선택 (배열 필드) */}
          {field && (
            <ul>
              {(FILTER_OPTIONS[selectedCategory] ?? []).map(option => {
                // 직업 카테고리에서 '전문직'은 네비게이션 아이템으로 처리
                if (selectedCategory === "job" && option === "전문직") {
                  return (
                    <li key={option}>
                      <button
                        className="w-full flex items-center justify-between px-4 py-4 border-b text-left active:bg-gray-50"
                        onClick={handleEnterProfessionalSub}
                      >
                        <span
                          className={cn(
                            "text-sm",
                            hasProfessionalSub && "text-rose-500 font-medium",
                          )}
                        >
                          전문직
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                      </button>
                    </li>
                  );
                }

                const isSelected = selectedValues.includes(option);
                return (
                  <li key={option}>
                    <button
                      className="w-full flex items-center justify-between px-4 py-4 border-b text-left active:bg-gray-50"
                      onClick={() => toggleArrayField(field, option)}
                    >
                      <span
                        className={cn(
                          "text-sm",
                          isSelected && "text-rose-500 font-medium",
                        )}
                      >
                        {option}
                      </span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-4 py-4 border-t shrink-0">
          <Button
            className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-base font-semibold"
            onClick={handleConfirmLevel2}
          >
            선택
          </Button>
        </div>
      </div>
    );
  }

  // ─── Level 1: 필터 목록 뷰 ────────────────────────────────────────
  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[60] bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 h-14 border-b shrink-0">
        <button
          onClick={onClose}
          className="text-sm text-gray-600 active:text-gray-900"
        >
          취소
        </button>
        <span className="font-semibold text-base">필터</span>
        <button
          onClick={handleResetAll}
          className="text-sm text-gray-500 active:text-rose-500"
        >
          모두 삭제
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul>
          {FILTER_CATEGORY_ORDER.map(category => {
            const summary = getFilterSummaryText(category, draft);
            const isActive = !isDefaultSummary(category);
            return (
              <li key={category}>
                <button
                  className="w-full flex items-center justify-between px-4 py-4 border-b text-left active:bg-gray-50"
                  onClick={() => handleSelectCategory(category)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">
                      {FILTER_LABELS[category]}
                    </div>
                    <div
                      className={cn(
                        "text-sm mt-0.5 truncate",
                        isActive ? "text-rose-500" : "text-gray-400",
                      )}
                    >
                      {summary}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="px-4 py-4 border-t shrink-0">
        <Button
          className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-base font-semibold"
          onClick={handleSearch}
        >
          결과 보기
        </Button>
      </div>
    </div>
  );
}
