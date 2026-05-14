import type { Area } from "react-easy-crop";

interface CroppedImageOptions {
  imageSrc: string;
  pixelCrop: Area;
  fileName: string;
  mimeType?: string;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

const DEFAULT_MIME_TYPE = "image/jpeg";
const DEFAULT_QUALITY = 0.9;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
    image.src = src;
  });
}

function getOutputSize(
  width: number,
  height: number,
  maxWidth?: number,
  maxHeight?: number,
) {
  const widthRatio = maxWidth ? maxWidth / width : 1;
  const heightRatio = maxHeight ? maxHeight / height : 1;
  const scale = Math.min(widthRatio, heightRatio, 1);

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error("크롭 이미지 생성에 실패했습니다."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

function getCroppedFileName(fileName: string, mimeType: string) {
  const extension = mimeType === "image/png" ? "png" : "jpg";
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  return `${baseName}-cropped.${extension}`;
}

export async function createCroppedImageFile({
  imageSrc,
  pixelCrop,
  fileName,
  mimeType = DEFAULT_MIME_TYPE,
  quality = DEFAULT_QUALITY,
  maxWidth,
  maxHeight,
}: CroppedImageOptions): Promise<File> {
  const image = await loadImage(imageSrc);
  const outputSize = getOutputSize(
    pixelCrop.width,
    pixelCrop.height,
    maxWidth,
    maxHeight,
  );

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("이미지 편집을 지원하지 않는 브라우저입니다.");
  }

  canvas.width = outputSize.width;
  canvas.height = outputSize.height;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize.width,
    outputSize.height,
  );

  const blob = await canvasToBlob(canvas, mimeType, quality);

  return new File([blob], getCroppedFileName(fileName, mimeType), {
    type: mimeType,
    lastModified: Date.now(),
  });
}
