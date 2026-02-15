import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import { formatChatTime } from "../utils/matchFormat";

interface ChatBubbleProps {
  message: string;
  createdAt: string;
  isMine: boolean;
  senderImage?: string | null;
  senderName?: string;
}

/**
 * 채팅 메시지 말풍선 컴포넌트
 * - 본인 메시지: 오른쪽 정렬, 핑크색 배경
 * - 상대방 메시지: 왼쪽 정렬, 회색 배경, 프로필 이미지+이름
 */
export function ChatBubble({
  message,
  createdAt,
  isMine,
  senderImage,
  senderName,
}: ChatBubbleProps) {
  const time = formatChatTime(createdAt);

  if (isMine) {
    return (
      <div className="flex justify-end items-end gap-2">
        <span className="text-xs text-gray-400">{time}</span>
        <div className="max-w-[70%] px-4 py-2.5 bg-pink-500 text-white rounded-2xl rounded-br-sm">
          <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <Avatar className="h-9 w-9 flex-shrink-0">
        <AvatarImage src={senderImage ?? undefined} alt={senderName} />
        <AvatarFallback className="text-xs">
          {senderName?.[0] || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        {senderName && (
          <span className="text-xs text-gray-500">{senderName}</span>
        )}
        <div className="flex items-end gap-2">
          <div className="max-w-[70%] px-4 py-2.5 bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm">
            <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
          </div>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  );
}
