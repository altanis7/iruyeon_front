import { useRef, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
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

type ChatViewportStyle = CSSProperties & {
  "--chat-visual-height": string;
  "--chat-visual-top": string;
};

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
  const [viewportStyle, setViewportStyle] = useState<ChatViewportStyle>({
    "--chat-visual-height": "100dvh",
    "--chat-visual-top": "0px",
  });

  const chatData = data?.data;
  const messages = chatData?.message ?? [];
  const currentUserId = currentUser?.id ? Number(currentUser.id) : null;

  useEffect(() => {
    if (!open) return;

    const updateViewport = () => {
      const visualViewport = window.visualViewport;
      const height = visualViewport?.height ?? window.innerHeight;
      const top = visualViewport?.offsetTop ?? 0;
      const nextHeight = `${height}px`;
      const nextTop = `${top}px`;

      setViewportStyle(previous => {
        if (
          previous["--chat-visual-height"] === nextHeight &&
          previous["--chat-visual-top"] === nextTop
        ) {
          return previous;
        }

        return {
          "--chat-visual-height": nextHeight,
          "--chat-visual-top": nextTop,
        };
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
    };
  }, [open]);

  // 새 메시지 추가 시 스크롤
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages.length, viewportStyle]);

  const handleSend = (message: string) => {
    sendChat.mutate({ matchId, message });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-white sm:bg-black/80" />
        <DialogPrimitive.Content
          onOpenAutoFocus={e => e.preventDefault()}
          style={viewportStyle}
          className="fixed left-[50%] top-[var(--chat-visual-top,0px)] z-[51] flex h-[var(--chat-visual-height,100dvh)] max-h-[var(--chat-visual-height,100dvh)] w-full max-w-md translate-x-[-50%] translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-white p-0 shadow-none outline-none duration-0 sm:top-[50%] sm:h-[80vh] sm:max-h-[80vh] sm:translate-y-[-50%] sm:rounded-lg sm:border sm:shadow-lg sm:duration-200"
        >
          <DialogHeader className="shrink-0 border-b px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
            <DialogTitle>채팅</DialogTitle>
          </DialogHeader>

          {/* 메시지 영역 */}
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4"
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
          <DialogClose className="absolute right-4 top-[calc(env(safe-area-inset-top)+1rem)] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none sm:top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
