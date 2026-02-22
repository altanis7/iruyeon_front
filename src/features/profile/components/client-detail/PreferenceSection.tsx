import { Heart } from 'lucide-react';
import type { ClientDetail, ClientInfoDetail } from '@/features/profile/api/profileApi';
import { SectionTitle } from './SectionTitle';
import { formatPreferredAge } from '@/features/profile/utils/clientFormat';

interface PreferenceSectionProps {
  client: ClientDetail | ClientInfoDetail;
}

export function PreferenceSection({ client }: PreferenceSectionProps) {
  const idealTypeTags = client.idealType?.split(',').map(s => s.trim()).filter(Boolean) || [];

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <SectionTitle icon={Heart} title="희망 조건" color="pink" />

      <div className="space-y-4 mt-5">
        {/* 희망 나이 */}
        <div className="flex justify-between items-center border-b border-slate-50 pb-3">
          <span className="text-sm text-slate-500">희망 나이</span>
          <span className="text-sm font-semibold text-slate-900">
            {formatPreferredAge(client.minPreferredAge, client.maxPreferredAge)}
          </span>
        </div>

        {/* 이상형 키워드 */}
        {idealTypeTags.length > 0 && (
          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-500 pt-0.5">이상형 키워드</span>
            <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
              {idealTypeTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-pink-50 text-pink-600 text-xs font-medium rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
