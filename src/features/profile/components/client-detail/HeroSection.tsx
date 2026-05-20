import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Pencil,
  Trash2,
  Briefcase,
  MapPin,
  Phone,
  HeartHandshake,
  Ruler,
  GraduationCap,
  Church,
  FileText,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shared/components/ui/carousel";
import { ProfileImage } from "@/shared/components/ui/profile-image";
import type {
  ClientDetail,
  ClientInfoDetail,
} from "@/features/profile/api/profileApi";
import { formatPhoneNumber } from "@/features/profile/utils/clientFormat";
import { GlassButton } from "./GlassButton";
import { InfoBadge } from "./InfoBadge";

interface HeroSectionProps {
  client: ClientDetail | ClientInfoDetail;
  isOwner: boolean;
  onBack: () => void;
  onToggleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReviewList?: () => void;
}

export function HeroSection({
  client,
  isOwner,
  onBack,
  onToggleStatus,
  onEdit,
  onDelete,
  onReviewList,
}: HeroSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    setImageLoaded(new Array(client.profileImages?.length ?? 0).fill(false));
  }, [client.profileImages]);

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
      {/* api 초기화 전 또는 첫 이미지 로드 전 스켈레톤 (바깥 relative div 기준 absolute) */}
      {hasImages && (!api || !imageLoaded[0]) && (
        <div className="absolute inset-0 z-20 bg-slate-900 animate-pulse" />
      )}

      {/* 배경 이미지 캐러셀 */}
      {hasImages ? (
        <Carousel setApi={setApi} className="h-full w-full">
          <CarouselContent className="h-full !ml-0" containerClassName="h-full">
            {client.profileImages.map((img, idx) => (
              <CarouselItem key={idx} className="h-full !pl-0">
                <img
                  src={img}
                  alt={`${client.name} 프로필 ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() =>
                    setImageLoaded(prev => {
                      const next = [...prev];
                      next[idx] = true;
                      return next;
                    })
                  }
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        /* 이미지 없을 때 폴백: ProfileImage 사용 */
        <ProfileImage
          src={null}
          alt={client.name}
          className="w-full h-full object-cover"
          fallbackSrc="/noImage.png"
        />
      )}

      {/* 캐러셀 커스텀 화살표 */}
      {current > 1 && (
        <button
          onClick={() => api?.scrollPrev()}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white"
        >
          <ChevronLeft className="w-8 h-8 drop-shadow-lg" strokeWidth={1.5} />
        </button>
      )}
      {current < count && (
        <button
          onClick={() => api?.scrollNext()}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white"
        >
          <ChevronRight className="w-8 h-8 drop-shadow-lg" strokeWidth={1.5} />
        </button>
      )}

      {/* 상단 네비게이션 */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
        <GlassButton size="icon" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" />
        </GlassButton>
        {isOwner && (
          <div className="flex gap-2">
            <GlassButton
              size="sm"
              variant={client.status !== "ACTIVE" ? "inactive" : "default"}
              onClick={onToggleStatus}
            >
              <EyeOff className="w-[18px] h-[18px]" />
              <span>
                {client.status === "ACTIVE"
                  ? "비활동"
                  : getStatusLabel(client.status)}
              </span>
            </GlassButton>
            {onReviewList && (
              <GlassButton size="sm" onClick={onReviewList}>
                <FileText className="w-[18px] h-[18px]" />
                <span>후기</span>
              </GlassButton>
            )}
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
          <span
            className={[
              "text-sm px-2 py-0.5 rounded-md",
              client.gender === "여자" ? "bg-pink-500/80" : "bg-blue-500/80",
            ].join(" ")}
          >
            {client.gender}
          </span>
        </div>

        {/* 전화번호 */}
        {client.phoneNumber && (
          <div className="flex items-center gap-2 text-white/80 mb-1">
            <Phone className="w-4 h-4 opacity-70" />
            <span className="text-sm">
              {formatPhoneNumber(client.phoneNumber)}
            </span>
          </div>
        )}

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
            icon={HeartHandshake}
            label="초혼"
            value={client.maritalStatus || "정보 없음"}
          />
          <InfoBadge icon={Ruler} label="키" value={`${client.height}cm`} />
          <InfoBadge
            icon={GraduationCap}
            label="학력"
            value={client.university || client.eduLevel}
          />
          <InfoBadge
            icon={Church}
            label="종교"
            value={client.religion || "정보 없음"}
          />
        </div>
      </div>
    </div>
  );
}

function getStatusLabel(status: string): string {
  if (status === "INACTIVE_MARRIED") return "비활동 · 성혼완료";
  if (status === "INACTIVE_DATING") return "비활동 · 교제중";
  if (status === "INACTIVE") return "비활동 · 해당없음";
  return "비활동";
}
