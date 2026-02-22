import type { LucideIcon } from 'lucide-react';

interface InfoBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function InfoBadge({ icon: Icon, label, value }: InfoBadgeProps) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-center min-h-[72px]">
      <Icon className="w-5 h-5 mb-1 opacity-80" />
      <span className="text-[10px] opacity-70">{label}</span>
      <span className="text-[13px] font-bold">{value}</span>
    </div>
  );
}
