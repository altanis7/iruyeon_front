import type { MatchStatus } from "../api/matchApi";

/**
 * 매칭 상태별 설정
 */
export const matchStatusConfig = {
  PENDING: {
    label: "대기중",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  ACCEPTED: {
    label: "수락됨",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  REJECTED: {
    label: "거절됨",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  CANCELED: {
    label: "취소됨",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  MATCHED: {
    label: "매칭됨",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  DEACTIVATED_USER: {
    label: "비활성 회원",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-500",
  },
} as const;

/**
 * 매칭 상태를 한글로 변환
 */
export function formatMatchStatus(status: MatchStatus): string {
  return matchStatusConfig[status].label;
}

/**
 * 날짜 포맷팅 ("2025-11-11T14:49:20.740483" → "2025.11.11")
 */
export function formatMatchDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}
