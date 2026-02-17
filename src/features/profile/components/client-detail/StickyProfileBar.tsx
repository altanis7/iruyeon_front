import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import type { ClientDetail, ClientInfoDetail } from '@/features/profile/api/profileApi';

interface StickyProfileBarProps {
  client: ClientDetail | ClientInfoDetail;
  isVisible: boolean;
  onPropose?: () => void;
}

export function StickyProfileBar({ client, isVisible, onPropose }: StickyProfileBarProps) {
  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center",
      "bg-white/80 backdrop-blur-xl border-b border-slate-200",
      "transition-opacity duration-300",
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div className="flex items-center gap-3">
        {/* 미니 프로필 이미지 */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
          {client.profileImages?.[0] ? (
            <img
              src={client.profileImages[0]}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm font-medium">
              {client.name[0]}
            </div>
          )}
        </div>

        {/* 이름 + 키 + 직장 */}
        <div>
          <span className="font-bold text-sm">{client.name}</span>
          <span className="text-xs text-slate-500 ml-1">
            {client.height}cm · {client.job}
          </span>
        </div>
      </div>

      {/* 제안 버튼 */}
      {onPropose && (
        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 rounded-full"
          onClick={onPropose}
        >
          제안
        </Button>
      )}
    </div>
  );
}
