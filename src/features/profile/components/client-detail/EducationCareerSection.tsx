import { GraduationCap, BookOpen, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionTitle } from './SectionTitle';
import type { ClientDetail, ClientInfoDetail } from '@/features/profile/api/profileApi';

interface EducationCareerSectionProps {
  client: ClientDetail | ClientInfoDetail;
}

export function EducationCareerSection({ client }: EducationCareerSectionProps) {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <SectionTitle icon={GraduationCap} title="학력 및 경력" color="blue" />

      <div className="space-y-6 mt-5">
        {/* 대학교 */}
        <TimelineItem
          icon={GraduationCap}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="대학교 및 전공"
          title={client.university}
          subtitle={client.major}
          description={`${client.eduLevel} 졸업`}
        />

        {/* 고등학교 */}
        {client.highSchool && (
          <TimelineItem
            icon={BookOpen}
            iconBg="bg-slate-50"
            iconColor="text-slate-400"
            label="고등학교"
            title={client.highSchool}
          />
        )}

        {/* 현직장 */}
        <TimelineItem
          icon={Briefcase}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          label="현직장"
          title={client.job}
          subtitle={client.jobDetail ? `(${client.jobDetail})` : undefined}
          description="근무 중"
          hasBorderTop
        />
      </div>
    </section>
  );
}

interface TimelineItemProps {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  label: string;
  title?: string;
  subtitle?: string;
  description?: string;
  hasBorderTop?: boolean;
}

function TimelineItem({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  title,
  subtitle,
  description,
  hasBorderTop,
}: TimelineItemProps) {
  return (
    <div className={cn('flex gap-4', hasBorderTop && 'border-t border-slate-50 pt-5')}>
      <div
        className={cn(
          'w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0',
          iconBg,
        )}
      >
        <Icon className={cn('w-5 h-5', iconColor)} />
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase font-bold tracking-tight mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold">
          {title || '정보 없음'}
          {subtitle && <span className="font-normal text-slate-500 ml-1">{subtitle}</span>}
        </p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
