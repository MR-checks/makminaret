import * as React from "react";
import { cn } from "@/lib/utils";

export type FieldErrorProps = React.HTMLAttributes<HTMLParagraphElement>;

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;

    return (
      <p
        ref={ref}
        className={cn("text-[0.875rem] font-medium text-[var(--seal)] mt-1.5", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FieldError.displayName = "FieldError";

export { FieldError };
