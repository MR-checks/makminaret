"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center h-4 w-4 shrink-0",
          className
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          className="peer absolute inset-0 m-0 h-full w-full appearance-none opacity-0 z-10 cursor-pointer disabled:cursor-not-allowed"
          {...props}
        />
        <div className="absolute inset-0 rounded-md border border-[var(--border-input)] bg-[var(--paper-raised)] transition-colors duration-140 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--navy)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--paper)] peer-checked:bg-[var(--navy)] peer-checked:border-[var(--navy)] peer-disabled:opacity-50" />
        <Check
          className="absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none"
          strokeWidth={3}
        />
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
