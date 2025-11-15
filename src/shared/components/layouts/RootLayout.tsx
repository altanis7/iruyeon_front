import { cn } from "@/lib/utils";

interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function RootLayout({ children, className }: RootLayoutProps) {
  return (
    <div className="h-dvh w-full max-w-md mx-auto">
      <main className={cn("h-full w-full flex flex-col", className)}>
        {children}
      </main>
    </div>
  );
}
