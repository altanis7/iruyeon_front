import { useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { useSendChat } from "../hooks/useSendChat";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

interface ChatModalProps {
  matchId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 채팅 모달 컴포넌트
 * - 채팅 내역 조회 및 표시
 * - 메시지 전송
 * - 자동 스크롤
 */
export function ChatModal({ matchId, open, onOpenChange }: ChatModalProps) {
  const { currentUser } = useAuth();
  const { data, isLoading, isError } = useChat(matchId, open);
  const sendChat = useSendChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatData = data?.data;
  const messages = chatData?.message ?? [];
  const currentUserId = currentUser?.id ? Number(currentUser.id) : null;

  // 새 메시지 추가 시 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = (message: string) => {
    sendChat.mutate({ matchId, message });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle>채팅</DialogTitle>
        </DialogHeader>

        {/* 메시지 영역 */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        >
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">불러오는 중...</div>
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500">채팅을 불러올 수 없습니다.</div>
            </div>
          )}

          {!isLoading && !isError && messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">아직 대화 내용이 없습니다.</div>
            </div>
          )}

          {!isLoading &&
            !isError &&
            messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.message}
                createdAt={msg.createdAt}
                isMine={currentUserId === msg.senderId}
                senderImage={
                  currentUserId !== msg.senderId
                    ? chatData?.oppositeMemberImage
                    : undefined
                }
                senderName={
                  currentUserId !== msg.senderId
                    ? chatData?.oppositeMemberName
                    : undefined
                }
              />
            ))}
        </div>

        {/* 입력 영역 */}
        <ChatInput onSend={handleSend} disabled={sendChat.isPending} />
      </DialogContent>
    </Dialog>
  );
}
