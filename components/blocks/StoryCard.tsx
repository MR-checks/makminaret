import * as React from "react";
import { cn } from "@/lib/utils";

export interface StoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  studentName: string;
  program: string;
  university: string;
  quote: string;
  imageSrc?: string;
}

const StoryCard = React.forwardRef<HTMLDivElement, StoryCardProps>(
  ({ className, studentName, program, university, quote, imageSrc, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col md:flex-row overflow-hidden rounded-md border border-[var(--rule)] bg-[var(--paper)] transition-colors hover:border-[var(--navy)]",
          className
        )}
        {...props}
      >
        <div className="md:w-[40%] bg-[var(--paper-raised)] border-b md:border-b-0 md:border-r border-[var(--rule)] relative aspect-square md:aspect-auto">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={`${studentName}'s story`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--slate)] font-mono text-sm">
              [TODO: Portrait]
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center p-6 md:p-8 lg:p-10">
          <blockquote className="mb-6">
            <span className="text-[2rem] font-display text-[var(--navy)] leading-none block mb-2">
              &quot;
            </span>
            <p className="text-[1.25rem] md:text-[1.5rem] leading-[1.4] text-[var(--ink)] font-normal text-balance">
              {quote}
            </p>
          </blockquote>

          <div className="mt-auto border-t border-[var(--rule)] pt-4">
            <div className="font-mono text-[0.875rem] text-[var(--ink)] mb-1 uppercase tracking-[0.04em]">
              {studentName}
            </div>
            <div className="text-sm text-[var(--slate)]">
              {program} at {university}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
StoryCard.displayName = "StoryCard";

export { StoryCard };
