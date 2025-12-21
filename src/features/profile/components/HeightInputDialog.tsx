/**
 * 키 입력 모달 (숫자 입력)
 */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface HeightInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  value?: number;
  onConfirm: (height: number) => void;
}

export function HeightInputDialog({
  open,
  onOpenChange,
  title = "키 입력",
  value,
  onConfirm,
}: HeightInputDialogProps) {
  const [height, setHeight] = useState<string>("");

  useEffect(() => {
    if (open && value !== undefined) {
      setHeight(String(value));
    } else if (!open) {
      setHeight("");
    }
  }, [open, value]);

  const handleConfirm = () => {
    const heightNum = parseInt(height, 10);
    if (!isNaN(heightNum) && heightNum > 0) {
      onConfirm(heightNum);
      onOpenChange(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="relative">
            <Input
              type="number"
              placeholder="예: 170"
              value={height}
              onChange={e => setHeight(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 text-center text-lg"
              autoFocus
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              cm
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!height || parseInt(height, 10) <= 0}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
