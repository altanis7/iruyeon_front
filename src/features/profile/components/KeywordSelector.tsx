/**
 * 키워드 복수 선택 컴포넌트 (성격/이상형)
 */
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface KeywordSelectorProps {
  keywords: readonly string[];
  selectedKeywords: string[];
  onSelectionChange: (selected: string[]) => void;
  className?: string;
}

export function KeywordSelector({
  keywords,
  selectedKeywords,
  onSelectionChange,
  className,
}: KeywordSelectorProps) {
  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      onSelectionChange(selectedKeywords.filter(k => k !== keyword));
    } else {
      onSelectionChange([...selectedKeywords, keyword]);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {keywords.map(keyword => (
        <Button
          key={keyword}
          type="button"
          variant={selectedKeywords.includes(keyword) ? "default" : "outline"}
          size="sm"
          onClick={() => toggleKeyword(keyword)}
          className={cn(
            "rounded-full px-4 py-2",
            selectedKeywords.includes(keyword)
              ? "bg-primary text-primary-foreground"
              : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
          )}
        >
          {keyword}
        </Button>
      ))}
    </div>
  );
}
