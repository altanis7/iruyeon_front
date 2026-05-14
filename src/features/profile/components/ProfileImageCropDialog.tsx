import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface ProfileImageCropDialogProps {
  open: boolean;
  imageSrc: string | null;
  fileName: string;
  isProcessing?: boolean;
  onCancel: () => void;
  onConfirm: (croppedAreaPixels: Area) => void;
}

const HERO_ASPECT_RATIO = 9 / 16;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

export function ProfileImageCropDialog({
  open,
  imageSrc,
  fileName,
  isProcessing = false,
  onCancel,
  onConfirm,
}: ProfileImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (!open) return;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, [open, imageSrc]);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, nextCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(nextCroppedAreaPixels);
    },
    [],
  );

  const handleConfirm = () => {
    if (!croppedAreaPixels) return;
    onConfirm(croppedAreaPixels);
  };

  const updateZoom = (nextZoom: number) => {
    setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom)));
  };

  const zoomProgress = ((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100;
  const zoomPercent = Math.round(zoom * 100);

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!nextOpen && !isProcessing) {
          onCancel();
        }
      }}
    >
      <DialogContent className="w-[calc(100%-2rem)] max-w-md gap-0 overflow-hidden rounded-2xl p-0 duration-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100">
        <DialogHeader className="px-5 pb-3 pt-5 text-left">
          <DialogTitle>사진 영역 조정</DialogTitle>
          <DialogDescription className="sr-only">
            {fileName} 사진의 표시 영역을 조정합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5">
          <div className="relative h-[520px] max-h-[62dvh] overflow-hidden rounded-xl bg-slate-950">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={HERO_ASPECT_RATIO}
                objectFit="cover"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <span className="text-sm font-semibold text-slate-800">확대</span>
              <span className="tabular-nums text-xs font-medium text-slate-500">
                {zoomPercent}%
              </span>
            </div>
            <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                onClick={() => updateZoom(zoom - ZOOM_STEP)}
                disabled={isProcessing || zoom <= MIN_ZOOM}
                aria-label="축소"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.01}
                value={zoom}
                onChange={event => updateZoom(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-rose-500 [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:shadow-md"
                style={{
                  background: `linear-gradient(to right, #f43f5e 0%, #f43f5e ${zoomProgress}%, #e2e8f0 ${zoomProgress}%, #e2e8f0 100%)`,
                }}
                disabled={isProcessing}
                aria-label="확대 비율"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                onClick={() => updateZoom(zoom + ZOOM_STEP)}
                disabled={isProcessing || zoom >= MAX_ZOOM}
                aria-label="확대"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 px-5 pb-5 pt-5">
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl"
            onClick={onCancel}
            disabled={isProcessing}
          >
            취소
          </Button>
          <Button
            type="button"
            className="h-12 rounded-xl bg-rose-500 text-white hover:bg-rose-600"
            onClick={handleConfirm}
            disabled={!croppedAreaPixels || isProcessing}
          >
            {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
            적용
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
