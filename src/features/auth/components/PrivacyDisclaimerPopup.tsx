import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { usePrivacyDisclaimer } from "@/features/auth/hooks/usePrivacyDisclaimer";
import { cn } from "@/lib/utils";

interface PrivacyDisclaimerPopupProps {
  enabled: boolean;
  userId: string;
}

export function PrivacyDisclaimerPopup({
  enabled,
  userId,
}: PrivacyDisclaimerPopupProps) {
  const { isOpen, confirm } = usePrivacyDisclaimer(enabled, userId);

  return (
    <Dialog open={isOpen}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          onInteractOutside={e => e.preventDefault()}
          onEscapeKeyDown={e => e.preventDefault()}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-[calc(100%-16px)] max-w-sm translate-x-[-50%] translate-y-[-50%]",
            "flex flex-col gap-5 rounded-2xl border bg-background px-5 py-6 shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          )}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
              <ShieldAlert className="h-6 w-6 text-rose-500" />
            </div>
            <DialogPrimitive.Title className="text-base font-semibold">
              서비스 이용 안내
            </DialogPrimitive.Title>
          </div>

          <DialogPrimitive.Description asChild>
            <div className="flex flex-col gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
              <p>
                본 서비스 내 정보의 무단 캡처, 저장, 배포 및 제3자 제공은
                금지됩니다.
              </p>
              <p>
                위반 시 이용약관에 따른 제재 및 법적 책임이 발생할 수 있습니다.
              </p>
            </div>
          </DialogPrimitive.Description>

          <Button
            onClick={confirm}
            className="w-full h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white"
          >
            확인했습니다
          </Button>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
