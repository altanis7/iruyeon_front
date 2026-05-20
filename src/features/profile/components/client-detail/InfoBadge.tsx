import type { LucideIcon } from 'lucide-react';

interface InfoBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function InfoBadge({ icon: Icon, label, value }: InfoBadgeProps) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/15 backdrop-blur-md border border-white/25 text-white text-center min-h-[72px] ring-1 ring-black/10 shadow-[0_8px_24px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.24)] [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
      <Icon className="w-5 h-5 mb-1 opacity-90 drop-shadow-md" />
      <span className="text-[10px] text-white/80">{label}</span>
      <span className="text-[13px] font-bold text-white">{value}</span>
    </div>
  );
}
