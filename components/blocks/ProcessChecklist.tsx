import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProcessStep {
  number: string;
  title: string;
  description: React.ReactNode;
}

export interface ProcessChecklistProps extends React.HTMLAttributes<HTMLDivElement> {
  steps?: ProcessStep[];
}

const defaultSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Check eligibility",
    description:
      "Takes 2 minutes. We review your details against actual university requirements.",
  },
  {
    number: "02",
    title: "Document review",
    description: "We translate and notarize your transcripts for the Turkish system.",
  },
  {
    number: "03",
    title: "Application",
    description:
      "Submitted directly to the university registrars. You receive updates via WhatsApp.",
  },
];

const ProcessChecklist = React.forwardRef<HTMLDivElement, ProcessChecklistProps>(
  ({ className, steps = defaultSteps, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full max-w-[1200px] mx-auto px-4 md:px-8", className)}
        {...props}
      >
        <div className="md:ml-[16.666%]">
          {" "}
          {/* Offset left by two columns (approx 2/12) */}
          <div className="flex flex-col gap-12">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start relative">
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[1.375rem] top-10 bottom-[-3rem] w-[1px] bg-[var(--rule)]" />
                )}

                {/* Stamp motif placeholder as section marker */}
                <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-[var(--paper-raised)] border border-[var(--rule)] z-10 text-[var(--seal)]">
                  {/* Subtle stamp echo: just the mono number in a seal color for now */}
                  <span className="font-mono text-[0.8125rem] font-bold">
                    {step.number}
                  </span>
                </div>

                <div className="flex flex-col pt-1">
                  <h3 className="font-display text-[var(--ink)] text-[clamp(1.25rem,2vw,1.5rem)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[var(--ink-soft)] text-[1rem] leading-[1.65] max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
ProcessChecklist.displayName = "ProcessChecklist";

export { ProcessChecklist };
