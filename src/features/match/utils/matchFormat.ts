import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import type { MatchStatus } from "../api/matchApi";

/**
 * 매칭 상태별 설정
 */
export const matchStatusConfig = {
  UNREAD: {
    label: "읽지 않음",
    description: "아직 확인하지 않은 매칭입니다",
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    headerBg: "bg-gradient-to-r from-purple-100 to-violet-100",
    headerText: "text-purple-800",
    headerDescText: "text-purple-600",
  },
  PENDING: {
    label: "담당 매니저 확인중",
    description: "담당 매니저가 확인하고 있습니다",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    headerBg: "bg-gradient-to-r from-amber-100 to-orange-100",
    headerText: "text-amber-800",
    headerDescText: "text-amber-600",
  },
  ACCEPTED: {
    label: "수락됨",
    description: "매칭이 수락되었습니다",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    headerBg: "bg-gradient-to-r from-green-100 to-emerald-100",
    headerText: "text-green-800",
    headerDescText: "text-green-600",
  },
  REJECTED: {
    label: "거절됨",
    description: "매칭 요청이 거절되었습니다",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    headerBg: "bg-gradient-to-r from-red-100 to-rose-100",
    headerText: "text-red-800",
    headerDescText: "text-red-600",
  },
  CANCELED: {
    label: "취소됨",
    description: "거절 완료 또는 상대방의 요청으로 취소",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    headerBg: "bg-gradient-to-r from-rose-100 to-pink-100",
    headerText: "text-rose-800",
    headerDescText: "text-rose-600",
  },
  MATCHED: {
    label: "매칭됨",
    description: "매칭이 성사되었습니다",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    headerBg: "bg-gradient-to-r from-blue-100 to-indigo-100",
    headerText: "text-blue-800",
    headerDescText: "text-blue-600",
  },
  DEACTIVATED_USER: {
    label: "비활성 회원",
    description: "회원이 현재 서비스를 이용하지 않고 있습니다",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-500",
    headerBg: "bg-gradient-to-r from-gray-100 to-slate-100",
    headerText: "text-gray-700",
    headerDescText: "text-gray-500",
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

/**
 * 채팅 시간 포맷팅 ("2025-12-19T13:25:12.46069" → "오후 01:25")
 */
export function formatChatTime(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, "a hh:mm", { locale: ko });
}
