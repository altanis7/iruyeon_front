import { BottomNavigation } from "./BottomNavigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-dvh w-full max-w-md mx-auto flex flex-col">
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
