/**
 * 프로필 생성 폼에서 사용하는 모든 선택 옵션 상수
 */

// 성별
export const GENDER_OPTIONS = ["여자", "남자"] as const;

// 직업 목록 (기획서 기준)
export const JOB_OPTIONS = [
  "전문직",
  "대기업",
  "중견기업",
  "중소기업",
  "공기업/기관",
  "부동산/임대",
  "연구원",
  "프리랜서",
  "자영업자",
  "기타",
] as const;

// 학력 수준 (기존 EDUCATION_TIERS 대체)
export const EDUCATION_LEVELS = [
  "고졸",
  "학사",
  "석사",
  "박사",
  "전문대",
] as const;

// 종교 목록 (기획서 기준)
export const RELIGION_OPTIONS = [
  "무교",
  "기독교",
  "불교",
  "천주교",
  "기타",
] as const;

// 재산 단위
export const PROPERTY_UNITS = ["천만원", "억"] as const;

// 성격/이상형 키워드
export const PERSONALITY_KEYWORDS = [
  "외향적인",
  "시원시원한",
  "유머있는",
  "감성적인",
  "상냥한",
  "자유로운",
  "귀여운",
  "차분한",
  "듬직한",
  "낙천적인",
  "지적인",
  "4차원적인",
  "열정적인",
  "섹시한",
] as const;

// 혼인 여부 (maritalStatus)
export const MARITAL_STATUS_OPTIONS = ["초혼", "재혼"] as const;

// 가족 관계 타입 (기획서 기준)
export const FAMILY_RELATION_OPTIONS = [
  "아버지",
  "어머니",
  "오빠",
  "형",
  "누나",
  "언니",
  "여동생",
  "남동생",
] as const;
