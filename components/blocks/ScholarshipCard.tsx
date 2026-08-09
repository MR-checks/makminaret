import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";

export interface ScholarshipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  amount: string;
  deadline: string;
  description: string;
  eligibility: string[];
}

const ScholarshipCard = React.forwardRef<HTMLDivElement, ScholarshipCardProps>(
  ({ className, name, amount, deadline, description, eligibility, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group flex flex-col justify-between rounded-md border border-[var(--rule)] bg-[var(--paper-raised)] p-6 transition-colors hover:border-[var(--navy)]",
          className
        )}
        {...props}
      >
        <div className="flex flex-col mb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="warning" className="uppercase tracking-[0.04em]">
              {amount}
            </Badge>
            <span className="font-mono text-[0.8125rem] text-[var(--slate)]">
              Ends {deadline}
            </span>
          </div>
          <h3 className="text-[1.25rem] font-medium text-[var(--ink)] leading-[1.3] mb-2">
            {name}
          </h3>
          <p className="text-[var(--ink-soft)] text-sm leading-[1.6]">{description}</p>
        </div>

        <div className="mt-auto border-t border-[var(--rule)] pt-4">
          <span className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-[var(--slate)] mb-2 block">
            Eligibility Criteria
          </span>
          <ul className="flex flex-col gap-1 mb-4">
            {eligibility.map((item, index) => (
              <li
                key={index}
                className="text-sm text-[var(--ink-soft)] flex items-start before:content-['-'] before:mr-2 before:text-[var(--slate)]"
              >
                {item}
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="inline-flex items-center text-sm font-medium text-[var(--navy)] hover:underline underline-offset-4"
          >
            Read requirements
            <ArrowRight className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    );
  }
);
ScholarshipCard.displayName = "ScholarshipCard";

export { ScholarshipCard };
