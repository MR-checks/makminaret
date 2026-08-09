import * as React from "react";
import { cn } from "@/lib/utils";

export interface TrustRowProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultItems = [
  { label: "Registered in", value: "Türkiye" },
  { label: "Registration No", value: "[TODO: confirm]" },
  { label: "Headquarters", value: "Ankara" },
];

const TrustRow = React.forwardRef<HTMLDivElement, TrustRowProps>(
  ({ className, items = defaultItems, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-y border-[var(--rule)] bg-[var(--paper-raised)] py-6",
          className
        )}
        {...props}
      >
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <div className="flex flex-col flex-wrap items-center justify-between gap-6 sm:flex-row">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col items-center sm:items-start">
                <span className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-[var(--slate)] mb-1">
                  {item.label}
                </span>
                <span className="text-[1.125rem] font-medium text-[var(--ink)]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
TrustRow.displayName = "TrustRow";

export { TrustRow };
