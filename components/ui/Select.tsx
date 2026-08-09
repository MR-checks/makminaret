import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, wrapperClassName, children, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", wrapperClassName)}>
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none border border-[var(--border-input)] bg-[var(--paper-raised)] px-3 py-2 pr-10 text-sm text-[var(--ink)] ring-offset-[var(--paper)] focus-visible:outline-none focus-visible:border-[var(--navy)] focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-140 rounded-md",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--slate)]">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
