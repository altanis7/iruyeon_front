import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  icon: LucideIcon;
  title: string;
  color: 'blue' | 'pink' | 'orange' | 'slate';
}

const colorStyles = {
  blue: { bg: 'bg-blue-100', icon: 'text-blue-600', title: 'text-blue-600' },
  pink: { bg: 'bg-pink-100', icon: 'text-pink-600', title: 'text-pink-500' },
  orange: { bg: 'bg-orange-100', icon: 'text-orange-600', title: 'text-orange-600' },
  slate: { bg: 'bg-slate-100', icon: 'text-slate-600', title: 'text-slate-900' },
};

export function SectionTitle({ icon: Icon, title, color }: SectionTitleProps) {
  const styles = colorStyles[color];
  return (
    <h2 className={cn('text-sm font-bold flex items-center gap-2', styles.title)}>
      <Icon className={cn('w-[18px] h-[18px]', styles.icon)} />
      {title}
    </h2>
  );
}
