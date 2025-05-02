"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  showBackground?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, value, indicatorClassName, showBackground = true, ...props },
    ref
  ) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-gray-100",
        className
      )}
      {...props}
    >
      {showBackground && (
        <div
          className="absolute h-full bg-current opacity-20 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      )}
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-current transition-all duration-500",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
