import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeroEducationProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  headline?: React.ReactNode;
  subHeadline?: React.ReactNode;
  form?: React.ReactNode;
}

const HeroEducation = React.forwardRef<HTMLDivElement, HeroEducationProps>(
  ({ className, eyebrow, headline, subHeadline, form, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-[var(--navy)] text-[var(--paper)] py-20 lg:py-32",
          className
        )}
        {...props}
      >
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start z-10 relative">
              {eyebrow && (
                <div className="animate-in fade-in-0 slide-in-from-bottom-3 duration-400 fill-mode-both delay-0 font-mono text-[var(--sand)] uppercase tracking-[0.04em] text-[0.8125rem] mb-6">
                  {eyebrow}
                </div>
              )}
              {headline && (
                <h1 className="animate-in fade-in-0 slide-in-from-bottom-3 duration-400 fill-mode-both delay-[60ms] font-display text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.02em] font-normal mb-6">
                  {headline}
                </h1>
              )}
              {subHeadline && (
                <div className="animate-in fade-in-0 slide-in-from-bottom-3 duration-400 fill-mode-both delay-[120ms] text-[1.125rem] leading-[1.65] text-[var(--sand)] max-w-2xl mb-10">
                  {subHeadline}
                </div>
              )}
              {form && (
                <div className="animate-in fade-in-0 slide-in-from-bottom-3 duration-400 fill-mode-both delay-[180ms] w-full max-w-2xl bg-white/5 p-6 rounded-md border border-white/10">
                  {form}
                </div>
              )}
            </div>

            {/* Image bleed area - visual placeholder */}
            <div className="lg:col-span-5 h-[400px] lg:h-[600px] relative w-full lg:-mr-12 animate-in fade-in-0 duration-700 fill-mode-both delay-[240ms]">
              <div className="absolute inset-0 bg-[var(--navy-deep)] flex items-center justify-center text-[var(--slate)] border border-white/10">
                <span className="font-mono text-sm">
                  [TODO: photograph] Bleed past right edge
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
HeroEducation.displayName = "HeroEducation";

export { HeroEducation };
