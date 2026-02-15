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
    <div className="flex items-center gap-2 p-4 border-t bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요"
        disabled={disabled}
        className={cn(
          "flex-1 px-4 py-2.5 border rounded-full text-sm",
          "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent",
          "disabled:bg-gray-100 disabled:cursor-not-allowed"
        )}
      />
      <Button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6"
      >
        전송
      </Button>
    </div>
  );
}
