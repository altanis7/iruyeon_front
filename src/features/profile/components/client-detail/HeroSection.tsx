import { useState, useEffect } from "react";
import {
  ChevronLeft,
  EyeOff,
  Pencil,
  Trash2,
  Briefcase,
  MapPin,
  Wallet,
  Ruler,
  GraduationCap,
  Heart,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shared/components/ui/carousel";
import type {
  ClientDetail,
  ClientInfoDetail,
} from "@/features/profile/api/profileApi";
import { GlassButton } from "./GlassButton";
import { InfoBadge } from "./InfoBadge";

interface HeroSectionProps {
  client: ClientDetail | ClientInfoDetail;
  isOwner: boolean;
  onBack: () => void;
  onToggleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function HeroSection({
  client,
  isOwner,
  onBack,
  onToggleStatus,
  onEdit,
  onDelete,
}: HeroSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const hasImages = client.profileImages && client.profileImages.length > 0;

  return (
    <div className="relative h-[680px] w-full overflow-hidden bg-slate-900">
      {/* 배경 이미지 캐러셀 */}
      {hasImages ? (
        <Carousel setApi={setApi} className="h-full">
          <CarouselContent className="h-full" containerClassName="h-full">
            {client.profileImages.map((img, idx) => (
              <CarouselItem key={idx} className="h-full">
                <img
                  src={img}
                  alt={`${client.name} 프로필 ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        /* 이미지 없을 때 폴백: 이름 이니셜 표시 */
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
          <span className="text-white text-7xl font-bold opacity-30">
            {client.name.charAt(0)}
          </span>
        </div>
      )}

      {/* 상단 그라디언트 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none" />

      {/* 하단 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* 상단 네비게이션 */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
        <GlassButton size="icon" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" />
        </GlassButton>
        {isOwner && (
          <div className="flex gap-2">
            <GlassButton size="sm" onClick={onToggleStatus}>
              <EyeOff className="w-[18px] h-[18px]" />
              <span>비공개</span>
            </GlassButton>
            <GlassButton size="icon" onClick={onEdit}>
              <Pencil className="w-[18px] h-[18px]" />
            </GlassButton>
            <GlassButton size="icon" variant="danger" onClick={onDelete}>
              <Trash2 className="w-[18px] h-[18px]" />
            </GlassButton>
          </div>
        )}
      </div>

      {/* 하단 콘텐츠 */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
        {/* 페이지네이션 */}
        {hasImages && count > 0 && (
          <div className="mb-4">
            <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-xs">
              {current} / {count}
            </span>
          </div>
        )}

        {/* 이름 + 나이 + 성별 */}
        <div className="flex items-baseline gap-2 mb-1">
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <span className="text-xl text-white/80">{client.age}</span>
          <span className="text-sm bg-blue-500/80 px-2 py-0.5 rounded-md">
            {client.gender}
          </span>
        </div>

        {/* 직장 정보 */}
        <div className="flex items-center gap-2 text-white/90 mb-1">
          <Briefcase className="w-5 h-5 opacity-70" />
          <span>
            {client.job} {client.jobDetail}
          </span>
        </div>

        {/* 거주지 */}
        <div className="flex items-center gap-2 text-white/90 mb-4">
          <MapPin className="w-5 h-5 opacity-70" />
          <span>{client.address}</span>
        </div>

        {/* 인포그래픽 배지 4열 */}
        <div className="grid grid-cols-4 gap-2">
          <InfoBadge
            icon={Wallet}
            label="자산"
            value={client.property || "정보 없음"}
          />
          <InfoBadge icon={Ruler} label="키" value={`${client.height}cm`} />
          <InfoBadge
            icon={GraduationCap}
            label="학력"
            value={client.university || client.eduLevel}
          />
          <InfoBadge icon={Heart} label="상태" value={client.maritalStatus} />
        </div>
      </div>
    </div>
  );
}
