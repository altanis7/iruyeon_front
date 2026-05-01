import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";

export function AdminLayout() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 gap-3">
        {/* 모바일 햄버거 버튼 */}
        <button
          className="md:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setSheetOpen(true)}
          aria-label="메뉴 열기"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">이루연 관리자</h1>
      </header>

      {/* 모바일 Sheet 메뉴 */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-6 pb-0">
            <SheetTitle className="text-lg font-bold text-gray-900 text-left">
              관리자 메뉴
            </SheetTitle>
          </SheetHeader>
          <AdminSidebar onNavClick={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex">
        {/* 데스크탑 사이드바 */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
