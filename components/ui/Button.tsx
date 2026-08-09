import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-140 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--navy)] text-white hover:bg-[var(--navy-deep)]":
              variant === "primary",
            "border border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--sand)]":
              variant === "secondary",
            "hover:bg-[var(--sand)] text-[var(--ink)]": variant === "ghost",
            "bg-[var(--whatsapp)] text-white hover:bg-[var(--whatsapp-hover)]":
              variant === "whatsapp",
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3": size === "sm",
            "h-11 px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          // Buttons are 4px (--radius-sm). MASTERPLAN §6.7, HANDOVER §1.2.
          "rounded-sm",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
