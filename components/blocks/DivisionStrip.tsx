import * as React from "react";
import { cn } from "@/lib/utils";

export interface DivisionStripProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  items: Array<{
    label: string;
    href: string;
  }>;
}

const DivisionStrip = React.forwardRef<HTMLDivElement, DivisionStripProps>(
  ({ className, title, items, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full border-y border-[var(--rule)] bg-[var(--sand)] py-4 overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span className="font-mono text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-[var(--slate)] whitespace-nowrap">
              {title}
            </span>

            {/* Divider dot */}
            <span className="hidden md:inline-block h-1 w-1 rounded-full bg-[var(--rule)]" />

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4">
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="font-medium text-[var(--ink)] hover:text-[var(--navy)] transition-colors text-sm"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
DivisionStrip.displayName = "DivisionStrip";

export { DivisionStrip };
