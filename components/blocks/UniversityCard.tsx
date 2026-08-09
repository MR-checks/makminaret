import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin } from "lucide-react";

export interface UniversityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  location: string;
  programCount: number;
  description: string;
}

const UniversityCard = React.forwardRef<HTMLDivElement, UniversityCardProps>(
  ({ className, name, location, programCount, description, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group flex flex-col justify-between overflow-hidden rounded-md border border-[var(--rule)] bg-[var(--paper)] transition-colors hover:border-[var(--navy)]",
          className
        )}
        {...props}
      >
        <div className="flex h-32 w-full items-center justify-center bg-[var(--paper-raised)] text-[var(--slate)] border-b border-[var(--rule)]">
          <span className="font-mono text-sm">[TODO: Logo]</span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center gap-1.5 text-[var(--slate)] mb-3">
            <MapPin className="h-4 w-4" />
            <span className="font-mono text-[0.8125rem] uppercase tracking-[0.04em]">
              {location}
            </span>
          </div>

          <h3 className="text-[1.5rem] font-medium text-[var(--ink)] leading-[1.3] mb-3">
            {name}
          </h3>

          <p className="text-[var(--ink-soft)] text-[0.875rem] leading-[1.6] line-clamp-3 mb-6">
            {description}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-[var(--rule)] pt-4 text-[var(--ink)]">
            <span className="font-medium text-sm">{programCount} Programs Available</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-sm transition-colors group-hover:bg-[var(--navy)] group-hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
UniversityCard.displayName = "UniversityCard";

export { UniversityCard };
