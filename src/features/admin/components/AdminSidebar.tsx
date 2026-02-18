import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "모든 매니저", path: "/admin" },
  { label: "승인 대기중 명단", path: "/admin/pending" },
];

const managerMenuItems: MenuItem[] = [
  { label: "회원 목록", path: "/" },
  { label: "매칭 관리", path: "/match" },
  { label: "내 회원 목록", path: "/profile" },
  { label: "내 정보", path: "/setting" },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen border-r border-gray-200 bg-white">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900">관리자 메뉴</h2>
      </div>
      <nav className="px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              cn(
                "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-pink-100 text-pink-700"
                  : "text-gray-600 hover:bg-gray-100"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}

        <div className="my-3 border-t border-gray-200" />
        <p className="px-4 pb-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
          매니저 메뉴
        </p>
        {managerMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
