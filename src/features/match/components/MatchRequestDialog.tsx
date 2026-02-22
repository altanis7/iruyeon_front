import { useState, useMemo } from "react";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/shared/components/ui/bottom-sheet";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useMyClients } from "@/features/profile/hooks/useMyClients";
import {
  mapMyClientToDisplay,
  type MyClientDisplayData,
} from "@/features/profile/api/profileApi";
import { useSendMatchRequest } from "../hooks/useSendMatchRequest";
import { cn } from "@/lib/utils";
import { Search, Check, Send } from "lucide-react";

interface MatchRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toClientId: number;
  toClientName: string;
  onSuccess?: () => void;
}

export function MatchRequestDialog({
  open,
  onOpenChange,
  toClientId,
  toClientName,
  onSuccess,
}: MatchRequestDialogProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data, isLoading } = useMyClients();
  const { mutate: sendMatchRequest, isPending } = useSendMatchRequest();

  // InfiniteQuery 페이지네이션 데이터 평탄화
  const myClients: MyClientDisplayData[] =
    data?.pages.flatMap((page) => page.data.list.map(mapMyClientToDisplay)) ||
    [];

  // 검색 필터링
  const filteredClients = useMemo(() => {
    if (!searchKeyword.trim()) return myClients;
    return myClients.filter((client) =>
      client.name.toLowerCase().includes(searchKeyword.toLowerCase()),
    );
  }, [myClients, searchKeyword]);

  const handleSubmit = () => {
    if (!selectedClientId) return;

    sendMatchRequest(
      {
        fromClientId: Number(selectedClientId),
        toClientId,
        message: message.trim(),
      },
      {
        onSuccess: () => {
          setSelectedClientId(null);
          setMessage("");
          setSearchKeyword("");
          onSuccess?.();
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedClientId(null);
      setMessage("");
      setSearchKeyword("");
    }
    onOpenChange(open);
  };

  return (
    <BottomSheet open={open} onOpenChange={handleOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle className="text-center text-lg font-semibold">
            <span className="text-gray-900">{toClientName}</span>
            <span className="text-gray-600 font-normal">님에게 매칭 제안</span>
          </BottomSheetTitle>
        </BottomSheetHeader>

        <div className="pb-4 space-y-4">
          {/* 검색바 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="담당 회원 이름으로 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>

          {/* 내 관리 회원 섹션 */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-medium">
              내 관리 회원
            </label>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-400 border-t-transparent" />
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                {searchKeyword
                  ? "검색 결과가 없습니다"
                  : "등록된 회원이 없습니다"}
              </div>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {filteredClients.map((client) => {
                  const isSelected = selectedClientId === client.id;
                  return (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => setSelectedClientId(client.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all",
                        isSelected
                          ? "border-pink-400 bg-pink-50"
                          : "border-gray-100 bg-white hover:border-gray-200",
                      )}
                    >
                      {/* 프로필 이미지 + 체크 */}
                      <div className="relative flex-shrink-0">
                        <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-200">
                          {client.image ? (
                            <img
                              src={client.image}
                              alt={client.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-lg text-gray-400">
                              {client.name[0]}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <div className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-pink-400 text-white">
                            <Check className="h-4 w-4" strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      {/* 회원 정보 */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-gray-900">
                            {client.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {client.birthYear}년생
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {client.university && `${client.university} · `}
                          {client.job}
                          {client.height && ` · ${client.height}cm`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 매니저 메시지 (선택) */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-medium">
              매니저 메시지 (선택)
            </label>
            <Textarea
              placeholder="상대 매니저에게 전달할 간단한 메시지를 입력하세요."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="bg-gray-50 border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300"
            />
          </div>

          {/* 매칭 제안 보내기 버튼 */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedClientId || isPending}
            className="w-full h-12 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl text-base disabled:bg-gray-300"
          >
            {isPending ? (
              "전송 중..."
            ) : (
              <>
                매칭 제안 보내기 <Send className="ml-1 h-4 w-4 inline" />
              </>
            )}
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}
