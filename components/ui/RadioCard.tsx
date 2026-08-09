import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface RadioCardProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

const RadioCard = React.forwardRef<HTMLInputElement, RadioCardProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative flex cursor-pointer rounded-md border border-[var(--border-input)] bg-[var(--paper-raised)] p-4 transition-colors duration-140 hover:bg-[var(--sand)] has-[:checked]:border-[var(--navy)] has-[:checked]:bg-[var(--paper-raised)] has-[:checked]:ring-1 has-[:checked]:ring-[var(--navy)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[var(--paper)] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
          className
        )}
      >
        <input type="radio" ref={ref} className="peer sr-only" {...props} />
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-medium text-[var(--ink)] peer-checked:text-[var(--navy)]">
            {label}
          </span>
          {description && (
            <span className="mt-1 text-sm text-[var(--slate)]">{description}</span>
          )}
        </div>
        <div className="ml-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--border-input)] bg-white peer-checked:border-[var(--navy)] peer-checked:bg-[var(--navy)]">
          <Check
            className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
          />
        </div>
      </label>
    );
  }
);
RadioCard.displayName = "RadioCard";

export { RadioCard };
