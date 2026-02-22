import { Users } from 'lucide-react';
import type { ClientFamilyMember, ClientInfoFamilyMember } from '@/features/profile/api/profileApi';
import { FamilyCard } from './FamilyCard';

interface FamilySectionProps {
  families: ClientFamilyMember[] | ClientInfoFamilyMember[];
}

export function FamilySection({ families }: FamilySectionProps) {
  if (!families || families.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold text-slate-900 px-1 flex items-center gap-2">
        <Users className="w-[18px] h-[18px]" />
        가족 구성 정보
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {families.map((family, idx) => (
          <FamilyCard key={idx} family={family} />
        ))}
      </div>
    </section>
  );
}
