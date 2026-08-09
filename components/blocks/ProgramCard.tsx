import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export interface ProgramCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  university: string;
  programName: string;
  degree: string;
  language: string;
  cost: string;
  originalCost?: string;
  href?: string;
}

const ProgramCard = React.forwardRef<HTMLAnchorElement, ProgramCardProps>(
  (
    {
      className,
      university,
      programName,
      degree,
      language,
      cost,
      originalCost,
      href,
      ...props
    },
    ref
  ) => {
    return (
      <a
        href={href || "#"}
        ref={ref}
        className={cn(
          "group flex flex-col justify-between rounded-md border border-[var(--rule)] bg-[var(--paper)] p-6 transition-colors hover:border-[var(--navy)]",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">{degree}</Badge>
            <Badge variant="default">{language}</Badge>
          </div>

          <div>
            <div className="font-mono text-[0.8125rem] text-[var(--slate)] mb-1 uppercase tracking-[0.04em]">
              {university}
            </div>
            <h3 className="text-[1.25rem] font-medium text-[var(--ink)] leading-[1.3]">
              {programName}
            </h3>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between border-t border-[var(--rule)] pt-4">
          <div className="flex flex-col">
            <span className="font-mono text-[0.8125rem] text-[var(--slate)] uppercase tracking-[0.04em]">
              Tuition / Year
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-[1.125rem] font-medium text-[var(--ink)]">
                {cost}
              </span>
              {originalCost && (
                <span className="font-mono text-[0.875rem] text-[var(--slate)] line-through">
                  {originalCost}
                </span>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="group-hover:bg-[var(--navy)] group-hover:text-white transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">View program</span>
          </Button>
        </div>
      </a>
    );
  }
);
ProgramCard.displayName = "ProgramCard";

export { ProgramCard };
