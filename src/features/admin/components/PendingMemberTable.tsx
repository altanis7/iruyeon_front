import type { AdminMember } from "../api/adminApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";

interface PendingMemberTableProps {
  members: AdminMember[];
  onApprove: (member: AdminMember) => void;
  onReject: (member: AdminMember) => void;
}

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function PendingMemberTable({ members, onApprove, onReject }: PendingMemberTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">이미지</th>
            <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">이름</th>
            <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">전화번호</th>
            <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">성별</th>
            <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">회사명</th>
            <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.memberImage ?? undefined} alt={member.name} />
                    <AvatarFallback className="bg-gray-200 text-gray-500">
                      {member.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </td>
              <td className="px-6 py-4 text-center text-sm text-gray-900">{member.name}</td>
              <td className="px-6 py-4 text-center text-sm text-gray-900">
                {formatPhoneNumber(member.phoneNumber)}
              </td>
              <td className="px-6 py-4 text-center text-sm text-gray-900">{member.gender}</td>
              <td className="px-6 py-4 text-center text-sm text-pink-600 font-medium">
                {member.company}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => onApprove(member)}
                  >
                    승인
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => onReject(member)}
                  >
                    거부
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
