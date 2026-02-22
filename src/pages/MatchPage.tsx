import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { useReceivedMatches } from "@/features/match/hooks/useReceivedMatches";
import { useSentMatches } from "@/features/match/hooks/useSentMatches";
import { useMatchedMatches } from "@/features/match/hooks/useMatchedMatches";
import { useMatchAlarm } from "@/features/match/hooks/useMatchAlarm";
import { MatchCard } from "@/features/match/components/MatchCard";

export function MatchPage() {
  // 받은 매칭
  const {
    data: receivedData,
    isLoading: isReceivedLoading,
    isFetchingNextPage: isReceivedFetchingNextPage,
    hasNextPage: hasReceivedNextPage,
    fetchNextPage: fetchReceivedNextPage,
  } = useReceivedMatches();

  // 보낸 매칭
  const {
    data: sentData,
    isLoading: isSentLoading,
    isFetchingNextPage: isSentFetchingNextPage,
    hasNextPage: hasSentNextPage,
    fetchNextPage: fetchSentNextPage,
  } = useSentMatches();

  // 매칭 완료
  const {
    data: matchedData,
    isLoading: isMatchedLoading,
    isFetchingNextPage: isMatchedFetchingNextPage,
    hasNextPage: hasMatchedNextPage,
    fetchNextPage: fetchMatchedNextPage,
  } = useMatchedMatches();

  // 알림 개수
  const { data: alarmData } = useMatchAlarm();

  // 모든 페이지의 매칭 데이터를 평탄화
  const receivedMatches = receivedData?.pages.flatMap(page => page.data.list) || [];
  const sentMatches = sentData?.pages.flatMap(page => page.data.list) || [];
  const matchedMatches = matchedData?.pages.flatMap(page => page.data.list) || [];

  // 알림 개수 (API 우선, fallback으로 newChatCnt 합산)
  const receivedAlarmCount =
    alarmData?.data?.receivedMatchAlarmCnt ??
    receivedMatches.reduce((sum, match) => sum + match.newChatCnt, 0);
  const sentAlarmCount =
    alarmData?.data?.sentMatchAlarmCnt ??
    sentMatches.reduce((sum, match) => sum + match.newChatCnt, 0);
  const matchedAlarmCount =
    alarmData?.data?.matchedMatchAlarmCnt ??
    matchedMatches.reduce((sum, match) => sum + match.newChatCnt, 0);

  return (
    <MainLayout>
      <Tabs defaultValue="received" className="flex flex-col">
        {/* 헤더 - 고정 */}
        <div className="sticky top-0 bg-white z-10 px-4 pt-safe-top pt-3 pb-3 border-b">
          <h1 className="text-xl font-bold mb-3">매칭 관리</h1>

          {/* 탭 */}
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="received" className="relative">
              받은 매칭
              {receivedAlarmCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-red-500 text-white rounded-full">
                  {receivedAlarmCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent">
              보낸 매칭
              {sentAlarmCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-red-500 text-white rounded-full">
                  {sentAlarmCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              매칭 완료
              {matchedAlarmCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-red-500 text-white rounded-full">
                  {matchedAlarmCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 받은 매칭 탭 - 스크롤 영역 */}
        <TabsContent value="received" className="mt-0">
          <div className="p-4 space-y-4">
            {isReceivedLoading ? (
              // 로딩 상태
              <div className="flex items-center justify-center py-12">
                <div className="text-sm text-gray-500">로딩 중...</div>
              </div>
            ) : receivedMatches.length === 0 ? (
              // 빈 상태
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500">받은 매칭이 없습니다</p>
              </div>
            ) : (
              // 매칭 목록
              <>
                {receivedMatches.map(match => (
                  <MatchCard key={match.matchId} match={match} />
                ))}

                {/* 무한 스크롤 트리거 */}
                {hasReceivedNextPage && (
                  <div className="flex items-center justify-center py-4">
                    {isReceivedFetchingNextPage ? (
                      <div className="text-sm text-gray-500">로딩 중...</div>
                    ) : (
                      <button
                        onClick={() => fetchReceivedNextPage()}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        더 보기
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* 보낸 매칭 탭 - 스크롤 영역 */}
        <TabsContent value="sent" className="mt-0">
          <div className="p-4 space-y-4">
            {isSentLoading ? (
              // 로딩 상태
              <div className="flex items-center justify-center py-12">
                <div className="text-sm text-gray-500">로딩 중...</div>
              </div>
            ) : sentMatches.length === 0 ? (
              // 빈 상태
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500">보낸 매칭이 없습니다</p>
              </div>
            ) : (
              // 매칭 목록
              <>
                {sentMatches.map(match => (
                  <MatchCard key={match.matchId} match={match} variant="sent" />
                ))}

                {/* 무한 스크롤 트리거 */}
                {hasSentNextPage && (
                  <div className="flex items-center justify-center py-4">
                    {isSentFetchingNextPage ? (
                      <div className="text-sm text-gray-500">로딩 중...</div>
                    ) : (
                      <button
                        onClick={() => fetchSentNextPage()}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        더 보기
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* 매칭 완료 탭 - 스크롤 영역 */}
        <TabsContent value="completed" className="mt-0">
          <div className="p-4 space-y-4">
            {isMatchedLoading ? (
              // 로딩 상태
              <div className="flex items-center justify-center py-12">
                <div className="text-sm text-gray-500">로딩 중...</div>
              </div>
            ) : matchedMatches.length === 0 ? (
              // 빈 상태
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500">매칭 완료 내역이 없습니다</p>
              </div>
            ) : (
              // 매칭 목록
              <>
                {matchedMatches.map(match => (
                  <MatchCard key={match.matchId} match={match} variant="matched" />
                ))}

                {/* 무한 스크롤 트리거 */}
                {hasMatchedNextPage && (
                  <div className="flex items-center justify-center py-4">
                    {isMatchedFetchingNextPage ? (
                      <div className="text-sm text-gray-500">로딩 중...</div>
                    ) : (
                      <button
                        onClick={() => fetchMatchedNextPage()}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        더 보기
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
