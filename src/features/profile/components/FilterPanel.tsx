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
const categoryToField: Partial<Record<FilterCategory, keyof FilterSearchParams>> = {
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
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory | null>(null);

  // 패널 열릴 때마다 draft 초기화 (hook order 유지를 위해 early return 전에 위치)
  useEffect(() => {
    if (open) {
      setDraft(initialFilters);
      setSelectedCategory(null);
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

  const handleBack = () => {
    setSelectedCategory(null);
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

  // ─── 2단계: 상세 선택 뷰 ───────────────────────────────────────────
  if (selectedCategory) {
    const field = categoryToField[selectedCategory];
    const selectedValues = field ? ((draft[field] as string[]) ?? []) : [];

    return (
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[60] bg-white flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 h-14 border-b shrink-0">
          <button onClick={handleBack} className="p-1 -ml-1">
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

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto">
          {/* 출생년도 범위 슬라이더 */}
          {selectedCategory === "birthYear" && (
            <div className="px-4 py-6">
              <p className="text-sm text-gray-500 mb-4">원하는 상대방 출생년도 범위를 선택하세요</p>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-rose-500 font-medium">
                  {new Date().getFullYear() - (draft.minBirthYear ?? BIRTH_YEAR_MIN)}세({draft.minBirthYear ?? BIRTH_YEAR_MIN}년생) 이상
                </span>
                <span className="text-sm text-rose-500 font-medium">
                  {new Date().getFullYear() - (draft.maxBirthYear ?? BIRTH_YEAR_MAX)}세({draft.maxBirthYear ?? BIRTH_YEAR_MAX}년생) 이하
                </span>
              </div>
              <DualRangeSlider
                min={BIRTH_YEAR_MIN}
                max={BIRTH_YEAR_MAX}
                step={1}
                minValue={draft.minBirthYear ?? BIRTH_YEAR_MIN}
                maxValue={draft.maxBirthYear ?? BIRTH_YEAR_MAX}
                onMinChange={v => setDraft(prev => ({ ...prev, minBirthYear: v }))}
                onMaxChange={v => setDraft(prev => ({ ...prev, maxBirthYear: v }))}
                unit="년"
              />
            </div>
          )}

          {/* 키 범위 슬라이더 */}
          {selectedCategory === "height" && (
            <div className="px-4 py-6">
              <p className="text-sm text-gray-500 mb-4">원하는 상대방 키 범위를 선택하세요</p>
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

        {/* 결과 보기 버튼 */}
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

  // ─── 1단계: 필터 목록 뷰 ──────────────────────────────────────────
  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[60] bg-white flex flex-col">
      {/* 헤더 */}
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

      {/* 필터 목록 */}
      <div className="flex-1 overflow-y-auto">
        <ul>
          {FILTER_CATEGORY_ORDER.map(category => {
            const summary = getFilterSummaryText(category, draft);
            const isActive = !isDefaultSummary(category);
            return (
              <li key={category}>
                <button
                  className="w-full flex items-center justify-between px-4 py-4 border-b text-left active:bg-gray-50"
                  onClick={() => setSelectedCategory(category)}
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

      {/* 결과 보기 버튼 */}
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
