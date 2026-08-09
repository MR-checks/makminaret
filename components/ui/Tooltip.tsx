"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  tooltipContent: React.ReactNode;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, children, tooltipContent, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
      <div
        className="relative inline-flex"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
        {isVisible && (
          <div
            ref={ref}
            role="tooltip"
            className={cn(
              "absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--ink)] px-3 py-1.5 text-xs text-[var(--paper)] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              className
            )}
            {...props}
          >
            {tooltipContent}
            <div className="absolute left-1/2 top-full -mt-px -translate-x-1/2 border-4 border-transparent border-t-[var(--ink)]" />
          </div>
        )}
      </div>
    );
  }
);
Tooltip.displayName = "Tooltip";

export { Tooltip };
