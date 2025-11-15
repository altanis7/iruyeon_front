import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

interface ProfileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * 프로필 검색바 컴포넌트
 * - 기본 구현 (추후 개선 가능)
 */
export function ProfileSearchBar({
  value,
  onChange,
  placeholder = "검색 (직업, 학벌, 지역 등)",
}: ProfileSearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 h-9"
      />
    </div>
  );
}
