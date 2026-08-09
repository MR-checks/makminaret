"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/RadioCard";
import { ArrowRight, ArrowLeft } from "lucide-react";

export type EligibilityWizardProps = React.HTMLAttributes<HTMLDivElement>;

const EligibilityWizard = React.forwardRef<HTMLDivElement, EligibilityWizardProps>(
  ({ className, ...props }, ref) => {
    // Shell implementation for Phase 2
    // Full 9-step logic will be implemented in Phase 6
    const [step, setStep] = React.useState(1);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-2xl mx-auto bg-[var(--paper)] rounded-md border border-[var(--rule)] overflow-hidden shadow-sm",
          className
        )}
        {...props}
      >
        {/* Progress Bar */}
        <div className="w-full bg-[var(--paper-raised)] h-1 border-b border-[var(--rule)] relative">
          <div
            className="absolute top-0 left-0 h-full bg-[var(--navy)] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 md:p-10">
          <div className="font-mono text-[0.8125rem] text-[var(--slate)] uppercase tracking-[0.04em] mb-4">
            Step {step} of 3
          </div>

          <h2 className="font-display text-[1.75rem] text-[var(--ink)] leading-tight mb-8">
            What level of study are you applying for?
          </h2>

          <div className="flex flex-col gap-4 mb-10">
            <RadioCard
              name="study_level"
              label="Bachelor's Degree (Undergraduate)"
              description="For high school graduates"
              defaultChecked
            />
            <RadioCard
              name="study_level"
              label="Master's Degree (Postgraduate)"
              description="For bachelor's degree holders"
            />
            <RadioCard
              name="study_level"
              label="PhD (Doctorate)"
              description="For master's degree holders"
            />
          </div>

          <div className="flex items-center justify-between border-t border-[var(--rule)] pt-6">
            <Button
              variant="ghost"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button onClick={() => setStep(Math.min(3, step + 1))}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
EligibilityWizard.displayName = "EligibilityWizard";

export { EligibilityWizard };
