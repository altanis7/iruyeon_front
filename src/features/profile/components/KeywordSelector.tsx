/**
 * 키워드 복수 선택 컴포넌트 (성격/이상형)
 */
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface KeywordSelectorProps {
  keywords: readonly string[];
  selectedKeywords: string[];
  onSelectionChange: (selected: string[]) => void;
  maxSelection?: number;
  className?: string;
}

export function KeywordSelector({
  keywords,
  selectedKeywords,
  onSelectionChange,
  maxSelection = 3,
  className,
}: KeywordSelectorProps) {
  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      onSelectionChange(selectedKeywords.filter(k => k !== keyword));
    } else {
      // 최대 선택 개수 제한
      if (selectedKeywords.length >= maxSelection) {
        return;
      }
      onSelectionChange([...selectedKeywords, keyword]);
    }
  };

  const isMaxReached = selectedKeywords.length >= maxSelection;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {keywords.map(keyword => {
          const isSelected = selectedKeywords.includes(keyword);
          const isDisabled = isMaxReached && !isSelected;

          return (
            <Button
              key={keyword}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => toggleKeyword(keyword)}
              disabled={isDisabled}
              className={cn(
                "rounded-full px-4 py-2",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {keyword}
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {selectedKeywords.length}/{maxSelection}개 선택됨
      </p>
    </div>
  );
}
