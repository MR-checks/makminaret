"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface StampResultProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
}

const StampResult = React.forwardRef<HTMLDivElement, StampResultProps>(
  ({ className, show = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center",
          show
            ? "animate-in fade-in zoom-in-[1.5] duration-300 ease-out fill-mode-both"
            : "opacity-0",
          className
        )}
        {...props}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[var(--seal)]"
        >
          {/* Outer thick ring */}
          <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="4" />

          {/* Inner thin ring */}
          <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="1" />

          {/* Circular Text Path */}
          <path id="stamp-text-path" d="M 60 16 A 44 44 0 1 1 59.9 16" fill="none" />

          <text
            className="font-mono text-[9px] uppercase font-bold tracking-[0.1em]"
            fill="currentColor"
          >
            <textPath href="#stamp-text-path" startOffset="50%" textAnchor="middle">
              GUARANTEED • PARTIAL • SCHOLARSHIP •
            </textPath>
          </text>

          {/* Center Graphic / Monogram */}
          <text
            x="60"
            y="66"
            className="font-display text-[2rem] font-medium"
            fill="currentColor"
            textAnchor="middle"
          >
            MAK
          </text>
        </svg>
      </div>
    );
  }
);
StampResult.displayName = "StampResult";

export { StampResult };
