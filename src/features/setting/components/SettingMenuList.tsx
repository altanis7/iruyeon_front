import { useNavigate } from "react-router-dom";
import { ChevronRight, User, Bell } from "lucide-react";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: User, label: "내 정보 수정", path: "/setting/profile" },
  { icon: Bell, label: "푸시 알림 설정", path: "/setting/notification" },
];

export function SettingMenuList() {
  const navigate = useNavigate();

  return (
    <div className="bg-white divide-y">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 active:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        );
      })}
    </div>
  );
}
