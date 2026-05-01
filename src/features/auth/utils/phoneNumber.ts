/**
 * 전화번호 포맷팅 유틸리티
 */

/**
 * 전화번호에 하이픈을 추가합니다.
 * 예: "01012345678" → "010-1234-5678"
 */
export function formatPhoneNumber(value: string): string {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, "");

  // 길이에 따라 포맷팅
  if (numbers.length <= 3) {
    return numbers;
  }
  if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}

/**
 * 전화번호에서 하이픈을 제거합니다.
 * 예: "010-1234-5678" → "01012345678"
 */
export function removePhoneNumberHyphens(value: string): string {
  return value.replace(/[^\d]/g, "");
}

/**
 * 전화번호 유효성 검사
 * 010으로 시작하는 11자리 숫자인지 확인
 */
export function isValidPhoneNumber(value: string): boolean {
  const numbers = removePhoneNumberHyphens(value);
  return /^010\d{8}$/.test(numbers);
}
