import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSearchBarProps {
  value?: string;
  placeholder?: string;
  onClick?: () => void;
  activeFilterCount?: number;
}

/**
 * 프로필 검색바 컴포넌트
 * - 클릭 시 필터 패널 오픈
 * - 활성 필터 개수 배지 표시
 */
export function ProfileSearchBar({
  value,
  placeholder = "검색 (직업, 학벌 등)",
  onClick,
  activeFilterCount = 0,
}: ProfileSearchBarProps) {
  return (
    <div
      className="relative flex-1 cursor-pointer"
      onClick={onClick}
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
      <div
        className={cn(
          "flex items-center pl-9 h-9 rounded-md border border-input bg-background text-sm select-none",
          activeFilterCount > 0 ? "pr-9" : "pr-3",
        )}
      >
        {value && value.trim() ? (
          <span className="text-rose-500 font-medium truncate">{value}</span>
        ) : (
          <span className="text-gray-400 truncate">{placeholder}</span>
        )}
      </div>
      {activeFilterCount > 0 && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 font-medium">
          {activeFilterCount}
        </span>
      )}
    </div>
  );
}
