import { useNavigate, useLocation } from "react-router";
import { Sheet, SheetContent } from "@/shared/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "회원 목록", path: "/" },
  { label: "매칭 관리", path: "/match" },
  { label: "내 회원 목록", path: "/profile" },
  { label: "내 정보", path: "/setting" },
];

const adminMenuItems: MenuItem[] = [
  { label: "모든 매니저", path: "/admin" },
  { label: "승인 대기중 명단", path: "/admin/pending" },
];

/**
 * 프로필 메뉴 드로어 컴포넌트
 * - 왼쪽에서 슬라이드되는 사이드 드로어
 * - 회원 목록, 매칭 관리, 내 회원 목록, 내 정보 메뉴
 * - ROLE_ADMIN인 경우 관리자 메뉴 추가 표시
 */
export function ProfileDrawer({ open, onOpenChange }: ProfileDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const isAdmin = currentUser?.role === "ROLE_ADMIN";

  const handleMenuClick = (path: string) => {
    navigate(path);
    onOpenChange(false); // 메뉴 클릭 시 드로어 닫기
  };

  const renderMenuItems = (items: MenuItem[]) =>
    items.map(item => {
      const isActive = location.pathname === item.path;
      return (
        <li key={item.path}>
          <button
            onClick={() => handleMenuClick(item.path)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-md transition-colors",
              isActive
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            {item.label}
          </button>
        </li>
      );
    });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64">
        <nav className="mt-6">
          <ul className="space-y-1">{renderMenuItems(menuItems)}</ul>

          {isAdmin && (
            <>
              <div className="my-3 border-t border-gray-200" />
              <p className="px-4 pb-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                관리자
              </p>
              <ul className="space-y-1">{renderMenuItems(adminMenuItems)}</ul>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
