import { useParams } from "react-router-dom";
import { ManagerInfoView } from "@/features/member/components/ManagerInfoView";

export function ManagerDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();

  return (
    <div className="h-dvh w-full overflow-y-auto bg-slate-50 max-w-md mx-auto scrollbar-hide shadow-[0_0_20px_#0000000d] pt-safe-top">
      <ManagerInfoView memberId={memberId!} />
    </div>
  );
}
