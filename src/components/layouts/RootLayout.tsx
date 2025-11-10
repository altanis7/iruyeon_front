import { cn } from "@/lib/utils";

interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function RootLayout({ children, className }: RootLayoutProps) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <main
        className={cn(
          "mx-auto min-h-dvh w-full",
          "px-4 py-6",
          "md:max-w-3xl md:px-6 md:py-8",
          "lg:max-w-4xl lg:px-8",
          "flex items-center justify-center",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
