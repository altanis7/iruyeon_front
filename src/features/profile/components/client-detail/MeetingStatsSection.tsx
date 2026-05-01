import { Phone, Users, Heart } from "lucide-react";
import { formatPhoneNumber } from "@/features/profile/utils/clientFormat";
import { SectionTitle } from "./SectionTitle";

interface MeetingStatsSectionProps {
  totalMeetingCnt?: number | null;
  currentMeetingCnt?: number | null;
  phoneNumber?: string | null;
}

export function MeetingStatsSection({
  totalMeetingCnt,
  currentMeetingCnt,
  phoneNumber,
}: MeetingStatsSectionProps) {
  const hasAny =
    totalMeetingCnt != null || currentMeetingCnt != null || phoneNumber;
  if (!hasAny) return null;

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <SectionTitle icon={Users} title="만남 현황" color="blue" />

      <div className="space-y-3 mt-5">
        {totalMeetingCnt != null && (
          <StatItem
            icon={<Heart className="w-4 h-4 text-rose-500" />}
            label="총 만남 횟수"
            value={`${totalMeetingCnt}회`}
          />
        )}
        {currentMeetingCnt != null && (
          <StatItem
            icon={<Heart className="w-4 h-4 text-blue-500" />}
            label="현재 만남 횟수"
            value={`${currentMeetingCnt}회`}
          />
        )}
        {phoneNumber && (
          <StatItem
            icon={<Phone className="w-4 h-4 text-slate-500" />}
            label="전화번호"
            value={formatPhoneNumber(phoneNumber)}
          />
        )}
      </div>
    </section>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}
