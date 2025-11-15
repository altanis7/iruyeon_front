import { useNavigate, useLocation } from "react-router";
import { Sheet, SheetContent } from "@/shared/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "프로필 관리", path: "/profile" },
  { label: "보낸 프로필", path: "/profile/sent" },
  { label: "받은 프로필", path: "/profile/received" },
];

/**
 * 프로필 메뉴 드로어 컴포넌트
 * - 왼쪽에서 슬라이드되는 사이드 드로어
 * - 프로필 관리, 보낸 프로필, 받은 프로필 메뉴
 */
export function ProfileDrawer({ open, onOpenChange }: ProfileDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (path: string) => {
    navigate(path);
    onOpenChange(false); // 메뉴 클릭 시 드로어 닫기
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64">
        <nav className="mt-6">
          <ul className="space-y-1">
            {menuItems.map(item => {
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
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
