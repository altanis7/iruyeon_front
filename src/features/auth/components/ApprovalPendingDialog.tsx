import { Clock, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface ApprovalPendingDialogProps {
  open: boolean;
  onConfirm: () => void;
}

export function ApprovalPendingDialog({
  open,
  onConfirm,
}: ApprovalPendingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="w-[90%] max-w-md rounded-2xl p-0 gap-0">
        {/* 헤더 영역 */}
        <DialogHeader className="px-8 pt-10 pb-6 text-center space-y-0">
          {/* 시계 아이콘 */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Clock className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>

          {/* 제목 */}
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            승인 대기 중입니다
          </DialogTitle>
        </DialogHeader>

        {/* 본문 영역 */}
        <div className="px-8 pb-6 space-y-6">
          {/* 메시지 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center space-y-2">
            <p className="text-gray-700 leading-relaxed">
              안녕하세요! 회원님의 정보를 검토하고 있습니다.
            </p>
            <p className="text-gray-700 leading-relaxed">
              관리자의 승인을 기다려주세요.
            </p>
            <p className="text-gray-700 leading-relaxed">
              승인 완료 시 전화 또는 문자로 안내됩니다.
            </p>
          </div>

          {/* 문의 섹션 */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-semibold text-amber-900">
                  문의사항이 있으신가요?
                </p>
                <div className="space-y-1 text-sm text-amber-800">
                  <p>
                    전화: <span className="font-semibold">02-514-3651</span>
                  </p>
                  <p className="text-xs text-amber-700">
                    운영시간: 평일 09:00 - 18:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 확인 버튼 */}
          <Button
            onClick={onConfirm}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold"
          >
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
