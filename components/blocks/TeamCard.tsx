import * as React from "react";
import { cn } from "@/lib/utils";

export interface TeamCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  bio: string;
  imageSrc?: string;
}

const TeamCard = React.forwardRef<HTMLDivElement, TeamCardProps>(
  ({ className, name, role, bio, imageSrc, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col group", className)} {...props}>
        <div className="relative aspect-[3/4] w-full bg-[var(--paper-raised)] border border-[var(--rule)] mb-4 overflow-hidden rounded-md">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--slate)] font-mono text-sm">
              [TODO: Portrait]
            </div>
          )}
        </div>

        <h3 className="text-[1.25rem] font-medium text-[var(--ink)] leading-tight mb-1">
          {name}
        </h3>

        <span className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-[var(--navy)] mb-3">
          {role}
        </span>

        <p className="text-[var(--ink-soft)] text-sm leading-[1.6]">{bio}</p>
      </div>
    );
  }
);
TeamCard.displayName = "TeamCard";

export { TeamCard };
