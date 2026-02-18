import { cn } from "@/lib/utils";

interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function RootLayout({ children, className }: RootLayoutProps) {
  return (
    <div className="h-dvh w-full max-w-md mx-auto bg-background shadow-[0_0_20px_#0000000d]">
      <main className={cn("h-full w-full flex flex-col", className)}>
        {children}
      </main>
    </div>
  );
}
