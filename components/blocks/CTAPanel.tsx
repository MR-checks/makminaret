import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Phone, ArrowRight } from "lucide-react";

export interface CTAPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
}

const CTAPanel = React.forwardRef<HTMLDivElement, CTAPanelProps>(
  (
    { className, title, description, primaryActionLabel, secondaryActionLabel, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full rounded-md bg-[var(--navy)] px-6 py-12 md:px-12 md:py-16 text-center overflow-hidden relative",
          className
        )}
        {...props}
      >
        {/* Background texture/pattern suggestion */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--sand)_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center">
          <h2 className="font-display text-[2.5rem] md:text-[3.5rem] leading-none text-white mb-6">
            {title}
          </h2>
          <p className="text-[1.125rem] text-[var(--sand)] mb-10 max-w-xl">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-[var(--navy)] hover:bg-[var(--sand)] hover:text-[var(--navy)]"
            >
              {primaryActionLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {secondaryActionLabel && (
              <Button size="lg" variant="whatsapp" className="w-full sm:w-auto">
                <Phone className="mr-2 h-4 w-4" />
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
CTAPanel.displayName = "CTAPanel";

export { CTAPanel };
