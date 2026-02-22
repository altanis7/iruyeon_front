import { useRef } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { useUploadImage } from "@/features/upload/hooks/useUploadImage";
import { cn } from "@/lib/utils";

interface ProfileImageUploadProps {
  imageUrl: string | null;
  onImageChange: (imageId: number | null, imageUrl: string | null) => void;
  disabled?: boolean;
}

export function ProfileImageUpload({
  imageUrl,
  onImageChange,
  disabled = false,
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadImage, isPending } = useUploadImage();

  const handleClick = () => {
    if (!disabled && !isPending) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하만 가능합니다.");
      return;
    }

    uploadImage(file, {
      onSuccess: data => {
        const imageId = data.data.imageIds[0];
        const uploadedUrl = data.data.imageUrls[0];
        onImageChange(imageId, uploadedUrl);
      },
      onError: error => {
        alert(`이미지 업로드 실패: ${error.message}`);
      },
    });

    // input 초기화 (같은 파일 재선택 가능하도록)
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* 이미지 업로드 영역 */}
      <div
        className={cn(
          "relative w-[120px] h-[120px] cursor-pointer transition-opacity",
          disabled || isPending ? "opacity-50 cursor-not-allowed" : "hover:opacity-80",
        )}
        onClick={handleClick}
      >
        {/* 이미지 또는 기본 아이콘 */}
        <div className="w-full h-full rounded-full border-2 border-pink-300 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="프로필 이미지"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* 로딩 오버레이 */}
          {isPending && (
            <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* 카메라 아이콘 (우하단) */}
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-md z-10">
          <Camera className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* 안내 텍스트 */}
      <p className="text-sm text-gray-500">
        프로필 이미지를 업로드해주세요
      </p>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isPending}
      />
    </div>
  );
}
