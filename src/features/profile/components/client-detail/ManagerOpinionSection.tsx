import { MessageSquareText } from 'lucide-react';

interface ManagerOpinionSectionProps {
  info: string;
}

export function ManagerOpinionSection({ info }: ManagerOpinionSectionProps) {
  if (!info) return null;

  return (
    <section className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl overflow-hidden relative">
      {/* 장식 효과 - 블러 원형 */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

      {/* 섹션 제목 */}
      <h2 className="text-xs font-bold opacity-60 mb-3 uppercase tracking-wider flex items-center gap-2">
        <MessageSquareText className="w-4 h-4" />
        매니저 종합 의견
      </h2>

      {/* 의견 텍스트 카드 */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <p className="text-sm font-medium leading-relaxed">{info}</p>
      </div>
    </section>
  );
}
