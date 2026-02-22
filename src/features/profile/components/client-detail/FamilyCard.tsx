import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBirthYear, formatFamilyJob } from '@/features/profile/utils/clientFormat';
import type { ClientFamilyMember, ClientInfoFamilyMember } from '@/features/profile/api/profileApi';

const MALE_RELATIONSHIPS = ['아버지', '형', '오빠', '남동생', '할아버지', '삼촌', '외삼촌', '아들', '손자'];
const FEMALE_RELATIONSHIPS = ['어머니', '언니', '누나', '여동생', '할머니', '이모', '고모', '딸', '손녀'];

function getGenderFromRelationship(relationship: string): 'male' | 'female' | 'unknown' {
  if (MALE_RELATIONSHIPS.includes(relationship)) return 'male';
  if (FEMALE_RELATIONSHIPS.includes(relationship)) return 'female';
  return 'unknown';
}

interface FamilyCardProps {
  family: ClientFamilyMember | ClientInfoFamilyMember;
}

function FamilyInfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col">
      <span className="text-slate-400 text-[11px] mb-0.5">{label}</span>
      <span className="font-medium text-slate-700">{value || '정보 없음'}</span>
    </div>
  );
}

export function FamilyCard({ family }: FamilyCardProps) {
  const gender = getGenderFromRelationship(family.relationship);

  const avatarBgColor = gender === 'male' ? 'bg-blue-50' :
                        gender === 'female' ? 'bg-pink-50' : 'bg-slate-50';
  const avatarIconColor = gender === 'male' ? 'text-blue-400' :
                          gender === 'female' ? 'text-pink-300' : 'text-slate-400';

  const ageDisplay = 'age' in family ? family.age : formatBirthYear(family.birthYear);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", avatarBgColor)}>
          <User className={cn("w-5 h-5", avatarIconColor)} />
        </div>
        <div>
          <span className="text-xs text-slate-500">{family.relationship}</span>
          <h3 className="text-sm font-bold">
            {family.name}
            <span className="text-xs font-normal text-slate-400 ml-1">({ageDisplay})</span>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 text-xs border-t border-slate-50 pt-4">
        <FamilyInfoItem label="거주지" value={family.address} />
        <FamilyInfoItem label="직업" value={formatFamilyJob(family.job, family.jobDetail)} />
        <FamilyInfoItem label="학력 / 종교" value={`${family.university || '-'} / ${family.religion || '-'}`} />
        {family.info && <FamilyInfoItem label="비고" value={family.info} />}
      </div>
    </div>
  );
}
