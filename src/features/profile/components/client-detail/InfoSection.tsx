import { User } from 'lucide-react';
import type { ClientDetail, ClientInfoDetail } from '@/features/profile/api/profileApi';
import { SectionTitle } from './SectionTitle';

interface InfoSectionProps {
  client: ClientDetail | ClientInfoDetail;
}

export function InfoSection({ client }: InfoSectionProps) {
  const personalityTags = client.personality?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const hobbyTags = client.hobby?.split(',').map(s => s.trim()).filter(Boolean) || [];

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <SectionTitle icon={User} title="개인 상세 정보" color="blue" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-5">
        <InfoItem label="본관" value={client.homeTown} />
        <InfoItem label="종교" value={client.religion} />
        <InfoItem label="혼인상태" value={client.maritalStatus} />
        <InfoItem label="자산수준" value={client.property} />
      </div>

      {(personalityTags.length > 0 || hobbyTags.length > 0) && (
        <div className="mt-4 pt-4 border-t border-slate-50">
          <span className="text-xs text-slate-400 mb-2 block">성격 및 취미</span>
          <div className="flex flex-wrap gap-1.5">
            {[...personalityTags, ...hobbyTags].map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 rounded-md text-sm font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col border-b border-slate-50 pb-2">
      <span className="text-xs text-slate-400 mb-0.5">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value || '정보 없음'}</span>
    </div>
  );
}
