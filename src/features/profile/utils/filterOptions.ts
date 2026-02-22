import type { FilterSearchParams } from "@/features/profile/api/profileApi";

export const BIRTH_YEAR_MIN = 1960;
export const BIRTH_YEAR_MAX = 2005;
export const HEIGHT_MIN = 140;
export const HEIGHT_MAX = 200;

export type FilterCategory =
  | "birthYear"
  | "job"
  | "religion"
  | "gender"
  | "eduLevel"
  | "universities"
  | "maritalStatus"
  | "height"
  | "keyword";

export const FILTER_LABELS: Record<FilterCategory, string> = {
  birthYear: "출생년도",
  job: "직업",
  religion: "종교",
  gender: "성별",
  eduLevel: "학력",
  universities: "대학교",
  maritalStatus: "결혼 여부",
  height: "키",
  keyword: "키워드",
};

export const FILTER_OPTIONS: Partial<Record<FilterCategory, readonly string[]>> = {
  job: ["대기업", "중견기업", "중소기업", "공기업/기관", "교육", "전문직", "프리랜서", "자영업자", "기타"],
  religion: ["기독교", "불교", "천주교", "무교", "기타"],
  gender: ["여자", "남자"],
  eduLevel: ["학사", "전문학사", "석사", "박사", "고졸"],
  universities: [
    "서울대/연세대/고려대/카이스트",
    "서강대/성균관대/한양대/이화여대",
    "중앙대/경희대/외대/시립대",
    "인서울",
    "해외대",
    "그 외",
  ],
  maritalStatus: ["초혼", "재혼"],
};

export const FILTER_CATEGORY_ORDER: FilterCategory[] = [
  "birthYear",
  "job",
  "religion",
  "gender",
  "eduLevel",
  "universities",
  "maritalStatus",
  "height",
  "keyword",
];

export const INITIAL_FILTER_STATE: FilterSearchParams = {
  keyword: "",
  minBirthYear: BIRTH_YEAR_MIN,
  maxBirthYear: BIRTH_YEAR_MAX,
  job: [],
  religion: [],
  gender: [],
  eduLevel: [],
  universities: [],
  maritalStatus: [],
  minHeight: HEIGHT_MIN,
  maxHeight: HEIGHT_MAX,
};

/** 각 필터의 현재 선택값 요약 텍스트 (1단계 행에 표시) */
export function getFilterSummaryText(
  category: FilterCategory,
  filters: FilterSearchParams,
): string {
  switch (category) {
    case "birthYear": {
      const minBY = filters.minBirthYear ?? BIRTH_YEAR_MIN;
      const maxBY = filters.maxBirthYear ?? BIRTH_YEAR_MAX;
      if (minBY === BIRTH_YEAR_MIN && maxBY === BIRTH_YEAR_MAX) return "모든 출생년도";
      const currentYear = new Date().getFullYear();
      return `${currentYear - minBY}세(${minBY}년생) 이상 ~ ${currentYear - maxBY}세(${maxBY}년생) 이하`;
    }
    case "height": {
      const minH = filters.minHeight ?? HEIGHT_MIN;
      const maxH = filters.maxHeight ?? HEIGHT_MAX;
      if (minH === HEIGHT_MIN && maxH === HEIGHT_MAX) return "모든 키";
      return `${minH}cm 이상 ~ ${maxH}cm 이하`;
    }
    case "keyword":
      return filters.keyword?.trim() || "키워드 없음";
    case "job":
      return filters.job?.length ? filters.job.join(", ") : "모든 직업";
    case "religion":
      return filters.religion?.length ? filters.religion.join(", ") : "모든 종교";
    case "gender":
      return filters.gender?.length ? filters.gender.join(", ") : "모든 성별";
    case "eduLevel":
      return filters.eduLevel?.length ? filters.eduLevel.join(", ") : "모든 학력";
    case "universities":
      return filters.universities?.length ? filters.universities.join(", ") : "모든 대학교";
    case "maritalStatus":
      return filters.maritalStatus?.length ? filters.maritalStatus.join(", ") : "모든 결혼 여부";
    default:
      return "";
  }
}

/** 활성 필터 개수 계산 */
export function countActiveFilters(filters: FilterSearchParams): number {
  let count = 0;
  if (filters.keyword?.trim()) count++;
  const minBY = filters.minBirthYear ?? BIRTH_YEAR_MIN;
  const maxBY = filters.maxBirthYear ?? BIRTH_YEAR_MAX;
  if (minBY !== BIRTH_YEAR_MIN || maxBY !== BIRTH_YEAR_MAX) count++;
  if ((filters.job?.length ?? 0) > 0) count++;
  if ((filters.religion?.length ?? 0) > 0) count++;
  if ((filters.gender?.length ?? 0) > 0) count++;
  if ((filters.eduLevel?.length ?? 0) > 0) count++;
  if ((filters.universities?.length ?? 0) > 0) count++;
  if ((filters.maritalStatus?.length ?? 0) > 0) count++;
  const minH = filters.minHeight ?? HEIGHT_MIN;
  const maxH = filters.maxHeight ?? HEIGHT_MAX;
  if (minH !== HEIGHT_MIN || maxH !== HEIGHT_MAX) count++;
  return count;
}

/** 하나라도 활성 필터가 있는지 */
export function hasActiveFilters(filters: FilterSearchParams): boolean {
  return countActiveFilters(filters) > 0;
}

/** 특정 카테고리의 필터 초기화 */
export function resetCategoryFilter(
  category: FilterCategory,
  filters: FilterSearchParams,
): FilterSearchParams {
  switch (category) {
    case "birthYear":
      return { ...filters, minBirthYear: BIRTH_YEAR_MIN, maxBirthYear: BIRTH_YEAR_MAX };
    case "height":
      return { ...filters, minHeight: HEIGHT_MIN, maxHeight: HEIGHT_MAX };
    case "keyword":
      return { ...filters, keyword: "" };
    case "job":
      return { ...filters, job: [] };
    case "religion":
      return { ...filters, religion: [] };
    case "gender":
      return { ...filters, gender: [] };
    case "eduLevel":
      return { ...filters, eduLevel: [] };
    case "universities":
      return { ...filters, universities: [] };
    case "maritalStatus":
      return { ...filters, maritalStatus: [] };
    default:
      return filters;
  }
}
