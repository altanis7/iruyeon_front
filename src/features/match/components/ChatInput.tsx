import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

/**
 * 채팅 메시지 입력 컴포넌트
 * - 입력창 + 전송 버튼
 * - Enter 키로 전송 지원
 */
export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-3 border-t bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 sm:gap-2 sm:p-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요"
        disabled={disabled}
        className={cn(
          "h-11 min-w-0 flex-1 rounded-full border px-4 text-base sm:h-10 sm:py-2.5 sm:text-sm",
          "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent",
          "disabled:bg-gray-100 disabled:cursor-not-allowed"
        )}
      />
      <Button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="h-11 shrink-0 rounded-full bg-pink-500 px-6 text-base font-semibold text-white hover:bg-pink-600 sm:h-10 sm:text-sm"
      >
        전송
      </Button>
    </div>
  );
}
