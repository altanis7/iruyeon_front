import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/shared/components/ui/sheet";
import { cn } from "@/lib/utils";

const BottomSheet = Sheet;

const BottomSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetContent>,
  React.ComponentPropsWithoutRef<typeof SheetContent>
>(({ className, children, ...props }, ref) => (
  <SheetContent
    ref={ref}
    side="bottom"
    className={cn(
      "rounded-t-2xl h-auto max-h-[85vh] px-4 overflow-y-auto",
      "pb-[max(2rem,env(safe-area-inset-bottom))]",
      "left-1/2 right-auto -translate-x-1/2 w-full max-w-md",
      className
    )}
    {...props}
  >
    {/* 드래그 핸들 (시각적 힌트 용도, 실제 drag-to-dismiss 미지원) */}
    <div className="mx-auto mt-2 mb-4 h-1 w-12 shrink-0 rounded-full bg-gray-300" />
    {children}
  </SheetContent>
));
BottomSheetContent.displayName = "BottomSheetContent";

const BottomSheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <SheetHeader
    className={cn("text-center sm:text-center", className)}
    {...props}
  />
);
BottomSheetHeader.displayName = "BottomSheetHeader";

const BottomSheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <SheetFooter
    className={cn("flex-col sm:flex-col", className)}
    {...props}
  />
);
BottomSheetFooter.displayName = "BottomSheetFooter";

const BottomSheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetTitle>,
  React.ComponentPropsWithoutRef<typeof SheetTitle>
>(({ className, ...props }, ref) => (
  <SheetTitle
    ref={ref}
    className={cn(className)}
    {...props}
  />
));
BottomSheetTitle.displayName = "BottomSheetTitle";

const BottomSheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetDescription>,
  React.ComponentPropsWithoutRef<typeof SheetDescription>
>(({ className, ...props }, ref) => (
  <SheetDescription
    ref={ref}
    className={cn(className)}
    {...props}
  />
));
BottomSheetDescription.displayName = "BottomSheetDescription";

export {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetFooter,
  BottomSheetTitle,
  BottomSheetDescription,
};
