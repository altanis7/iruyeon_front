import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/components/ui/carousel";
import { cn } from "@/lib/utils";

// 최대 업로드 가능한 사진 수
// TODO: 필요시 이 값을 변경하여 최대 사진 수를 조정할 수 있습니다
const MAX_PHOTOS = 5;

interface PhotoUploadProps {
  photos: string[]; // 현재 업로드된 사진 URL 배열
  mainPhotoIndex: number; // 대표 사진 인덱스
  onPhotosChange: (photos: string[]) => void;
  onMainPhotoChange: (index: number) => void;
}

export function PhotoUpload({
  photos,
  mainPhotoIndex,
  onPhotosChange,
  onMainPhotoChange,
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  // 파일을 Base64로 변환 (목업용 - 실제로는 서버에 업로드)
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // 파일 선택 핸들러
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    try {
      const base64Photos = await Promise.all(
        filesToUpload.map(file => convertToBase64(file)),
      );
      const newPhotos = [...photos, ...base64Photos];
      onPhotosChange(newPhotos);

      // 첫 번째 사진이면 자동으로 대표 사진으로 설정
      if (photos.length === 0 && base64Photos.length > 0) {
        onMainPhotoChange(0);
      }
    } catch (error) {
      console.error("사진 업로드 실패:", error);
      alert("사진 업로드에 실패했습니다.");
    }
  };

  // 사진 삭제 핸들러
  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);

    // 삭제한 사진이 대표 사진이었다면 첫 번째 사진을 대표로 설정
    if (index === mainPhotoIndex && newPhotos.length > 0) {
      onMainPhotoChange(0);
    } else if (index < mainPhotoIndex) {
      // 대표 사진보다 앞에 있는 사진을 삭제했다면 인덱스 조정
      onMainPhotoChange(mainPhotoIndex - 1);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToUpload = Array.from(files)
      .filter(file => file.type.startsWith("image/"))
      .slice(0, remainingSlots);

    try {
      const base64Photos = await Promise.all(
        filesToUpload.map(file => convertToBase64(file)),
      );
      const newPhotos = [...photos, ...base64Photos];
      onPhotosChange(newPhotos);

      if (photos.length === 0 && base64Photos.length > 0) {
        onMainPhotoChange(0);
      }
    } catch (error) {
      console.error("사진 업로드 실패:", error);
      alert("사진 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      {photos.length < MAX_PHOTOS && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-gray-300 hover:border-primary",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="photo-upload"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-600">
                사진을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-gray-400">
                최대 {MAX_PHOTOS}장 ({photos.length}/{MAX_PHOTOS})
              </p>
            </div>
          </label>
        </div>
      )}

      {/* 업로드된 사진 목록 */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <Label>업로드된 사진 ({photos.length}개)</Label>

          {/* 대표 사진 (크게) */}
          <Card className="relative overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={photos[mainPhotoIndex]}
                alt="대표 사진"
                className="w-full h-full object-cover"
              />
              {/* 대표 사진 배지 */}
              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded shadow-md">
                대표 사진
              </div>
              {/* 삭제 버튼 */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleRemovePhoto(mainPhotoIndex)}
              >
                삭제
              </Button>
            </div>
          </Card>

          {/* 썸네일 캐로셀 */}
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {photos.map((photo, index) => (
                <CarouselItem key={index} className="pl-2 basis-1/3">
                  <div
                    className={cn(
                      "relative cursor-pointer transition-all rounded-md overflow-hidden",
                      "aspect-square border-2",
                      mainPhotoIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-gray-300",
                    )}
                    onClick={() => onMainPhotoChange(index)}
                  >
                    <img
                      src={photo}
                      alt={`사진 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      className="absolute top-0.5 right-0.5 h-5 w-5 p-0 text-xs bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemovePhoto(index);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
}
