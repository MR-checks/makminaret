"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  onRemove?: () => void;
  disabled?: boolean;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, children, onRemove, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md border border-[var(--border-input)] bg-[var(--paper-raised)] px-2.5 py-0.5 text-xs font-medium text-[var(--ink)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--navy)] focus:ring-offset-2",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            className="ml-1 rounded-sm outline-none ring-offset-[var(--paper)] focus:ring-2 focus:ring-[var(--navy)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onRemove}
            disabled={disabled}
            aria-label="Remove tag"
          >
            <X className="h-3 w-3 hover:text-[var(--seal)] transition-colors" />
          </button>
        )}
      </div>
    );
  }
);
Tag.displayName = "Tag";

export { Tag };
