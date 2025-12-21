import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function ClientPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: ClientPaginationProps) {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious || isLoading}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        이전
      </Button>

      <span className="text-sm text-gray-600 min-w-[60px] text-center">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext || isLoading}
      >
        다음
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
