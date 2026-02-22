/**
 * 프로필 사진 업로더 컴포넌트
 * 레이아웃: 상단 큰 대표 사진 + 하단 2개 추가 사진
 * 첫 번째 사진이 대표(썸네일) 이미지로 사용됨
 */
import { useRef, useState, useEffect } from "react";
import { Plus, X, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { useUploadImage } from "@/features/upload/hooks/useUploadImage";
import { cn } from "@/lib/utils";

interface PhotoSlot {
  imageId: number | null;
  imageUrl: string | null;
  isUploading: boolean;
}

interface ProfilePhotoUploaderProps {
  imageIds: number[];
  imageUrls: string[];
  onImagesChange: (imageIds: number[], imageUrls: string[]) => void;
  disabled?: boolean;
}

const MAX_SLOTS = 3;

export function ProfilePhotoUploader({
  imageIds,
  imageUrls,
  onImagesChange,
  disabled = false,
}: ProfilePhotoUploaderProps) {
  // 각 슬롯별 파일 입력 ref
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // 각 슬롯별 mutation (독립적인 업로드 상태 관리)
  const uploadMutation0 = useUploadImage();
  const uploadMutation1 = useUploadImage();
  const uploadMutation2 = useUploadImage();
  const uploadMutations = [uploadMutation0, uploadMutation1, uploadMutation2];

  // 내부 슬롯 상태
  const [slots, setSlots] = useState<PhotoSlot[]>(() =>
    Array.from({ length: MAX_SLOTS }, (_, i) => ({
      imageId: imageIds[i] ?? null,
      imageUrl: imageUrls[i] ?? null,
      isUploading: false,
    }))
  );

  // props 변경 시 슬롯 상태 동기화
  useEffect(() => {
    setSlots(
      Array.from({ length: MAX_SLOTS }, (_, i) => ({
        imageId: imageIds[i] ?? null,
        imageUrl: imageUrls[i] ?? null,
        isUploading: slots[i]?.isUploading ?? false,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageIds, imageUrls]);

  // 슬롯 클릭 핸들러
  const handleSlotClick = (slotIndex: number) => {
    if (disabled || slots[slotIndex].isUploading) return;
    fileInputRefs[slotIndex].current?.click();
  };

  // 파일 선택 핸들러
  const handleFileChange = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하만 가능합니다.");
      return;
    }

    // 업로드 시작 - 해당 슬롯만 로딩 상태로
    setSlots(prev =>
      prev.map((slot, i) =>
        i === slotIndex ? { ...slot, isUploading: true } : slot
      )
    );

    uploadMutations[slotIndex].mutate(file, {
      onSuccess: data => {
        const newImageId = data.data.imageIds[0];
        const newImageUrl = data.data.imageUrls[0];

        // 슬롯 업데이트
        const newSlots = slots.map((slot, i) =>
          i === slotIndex
            ? { imageId: newImageId, imageUrl: newImageUrl, isUploading: false }
            : slot
        );
        setSlots(newSlots);

        // 부모에게 변경 알림
        const newIds = newSlots.map(s => s.imageId).filter((id): id is number => id !== null);
        const newUrls = newSlots.map(s => s.imageUrl).filter((url): url is string => url !== null);
        onImagesChange(newIds, newUrls);
      },
      onError: error => {
        toast.error(`이미지 업로드 실패: ${error.message}`);
        setSlots(prev =>
          prev.map((slot, i) =>
            i === slotIndex ? { ...slot, isUploading: false } : slot
          )
        );
      },
    });

    // input 초기화 (같은 파일 재선택 가능하도록)
    e.target.value = "";
  };

  // 이미지 삭제 핸들러
  const handleDelete = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 슬롯 클릭 이벤트 전파 방지

    const newSlots = slots.map((slot, i) =>
      i === slotIndex ? { imageId: null, imageUrl: null, isUploading: false } : slot
    );
    setSlots(newSlots);

    // 부모에게 변경 알림
    const newIds = newSlots.map(s => s.imageId).filter((id): id is number => id !== null);
    const newUrls = newSlots.map(s => s.imageUrl).filter((url): url is string => url !== null);
    onImagesChange(newIds, newUrls);
  };

  // 메인 슬롯 (대표 사진)
  const mainSlot = slots[0];
  // 추가 사진 슬롯들
  const subSlots = [slots[1], slots[2]];

  return (
    <div className="w-full space-y-3">
      {/* 대표 사진 슬롯 (큰 사이즈) */}
      <div className="relative">
        <div
          className={cn(
            "relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all",
            "border bg-[#fcfdfe] border-[#f7f8fa]",
            mainSlot.imageUrl && "border-gray-200",
            disabled || mainSlot.isUploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100"
          )}
          onClick={() => handleSlotClick(0)}
        >
          {mainSlot.imageUrl ? (
            <>
              <img
                src={mainSlot.imageUrl}
                alt="대표 사진"
                className="w-full h-full object-cover"
              />
              {/* 대표 뱃지 - 이미지가 있을 때만 표시 */}
              <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-pink-500 text-white text-xs font-medium rounded-full">
                대표
              </div>
              {/* 삭제 버튼 */}
              {!disabled && !mainSlot.isUploading && (
                <button
                  type="button"
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                  onClick={(e) => handleDelete(0, e)}
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </>
          ) : (
            /* 빈 슬롯 */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Camera className="w-10 h-10 text-gray-400" />
              <span className="text-sm text-gray-500">대표 사진 등록</span>
            </div>
          )}

          {/* 로딩 오버레이 */}
          {mainSlot.isUploading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRefs[0]}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(0, e)}
          disabled={disabled || mainSlot.isUploading}
        />
      </div>

      {/* 추가 사진 슬롯들 (2개 가로 배치) */}
      <div className="grid grid-cols-2 gap-3">
        {subSlots.map((slot, idx) => {
          const slotIndex = idx + 1; // 실제 슬롯 인덱스 (1, 2)
          return (
            <div key={slotIndex} className="relative">
              <div
                className={cn(
                  "relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer transition-all",
                  "border bg-[#fcfdfe] border-[#f7f8fa]",
                  slot.imageUrl && "border-gray-200",
                  disabled || slot.isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                )}
                onClick={() => handleSlotClick(slotIndex)}
              >
                {slot.imageUrl ? (
                  <>
                    <img
                      src={slot.imageUrl}
                      alt={`추가 사진 ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* 삭제 버튼 */}
                    {!disabled && !slot.isUploading && (
                      <button
                        type="button"
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                        onClick={(e) => handleDelete(slotIndex, e)}
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </>
                ) : (
                  /* 빈 슬롯 */
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <Plus className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500">추가 사진 {idx + 1}</span>
                  </div>
                )}

                {/* 로딩 오버레이 */}
                {slot.isUploading && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* 숨겨진 파일 입력 */}
              <input
                ref={fileInputRefs[slotIndex]}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(slotIndex, e)}
                disabled={disabled || slot.isUploading}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
