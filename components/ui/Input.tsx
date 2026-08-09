import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full border border-[var(--border-input)] bg-[var(--paper-raised)] px-3 py-2 text-sm text-[var(--ink)] ring-offset-[var(--paper)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--slate)] focus-visible:outline-none focus-visible:border-[var(--navy)] focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-140 rounded-md",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
