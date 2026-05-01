/**
 * 클라이언트 데이터 포맷팅 유틸리티
 */

export type ClientStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "INACTIVE_MARRIED"
  | "INACTIVE_DATING"
  | "DELETED";

const CLIENT_STATUS_MAP: Record<ClientStatus, string> = {
  ACTIVE: "활동",
  INACTIVE: "비활동",
  INACTIVE_MARRIED: "성혼 완료",
  INACTIVE_DATING: "교제중",
  DELETED: "탈퇴",
};

export function formatClientStatus(status: ClientStatus): string {
  return CLIENT_STATUS_MAP[status] ?? status;
}

/**
 * null 또는 빈 문자열 처리
 */
export function formatValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "정보 없음";
  }
  return String(value);
}

/**
 * 키 포맷 (cm 단위)
 */
export function formatHeight(height: number | null): string {
  if (!height) return "정보 없음";
  return `${height}cm`;
}

/**
 * 희망 나이 범위 포맷
 */
export function formatPreferredAge(
  minAge: number | null,
  maxAge: number | null,
): string {
  if (!minAge || !maxAge) return "정보 없음";
  return `${minAge}세 ~ ${maxAge}세`;
}

/**
 * 직업 정보 포맷 (직업 + 직업상세)
 */
export function formatJobInfo(job: string, jobDetail: string | null): string {
  if (!jobDetail) return formatValue(job);
  return `${job} · ${jobDetail}`;
}

/**
 * 가족 구성원 직업 포맷
 */
export function formatFamilyJob(
  job: string | null,
  jobDetail: string | null,
): string {
  if (job) return job;
  if (jobDetail) return jobDetail;
  return "정보 없음";
}

/**
 * 출생년도 포맷
 */
export function formatBirthYear(birthYear: number | null): string {
  if (!birthYear) return "정보 없음";
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear + 1;
  return `${birthYear}년생 (${age}세)`;
}

/**
 * 이름과 출생년도 포맷 (예: "장*영(2000년생)")
 */
export function formatNameWithBirthYear(
  name: string,
  birthYear: number | null,
): string {
  if (!birthYear) return formatValue(name);
  return `${name}(${birthYear}년생)`;
}

/**
 * 전화번호 하이픈 포맷 (예: "01024523333" → "010-2452-3333")
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "정보 없음";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11)
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  if (digits.length === 10)
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  if (digits.length === 9)
    return digits.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
  return phone;
}
