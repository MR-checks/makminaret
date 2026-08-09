import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export interface ArticleCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageSrc?: string;
  href?: string;
}

const ArticleCard = React.forwardRef<HTMLAnchorElement, ArticleCardProps>(
  ({ className, title, excerpt, date, category, imageSrc, href, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href || "#"}
        className={cn(
          "group flex flex-col overflow-hidden rounded-md border border-[var(--rule)] bg-[var(--paper)] transition-all hover:border-[var(--navy)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        <div className="relative aspect-[16/9] w-full bg-[var(--paper-raised)] border-b border-[var(--rule)] overflow-hidden">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--slate)] font-mono text-sm">
              [TODO: Image]
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-[var(--seal)]">
              {category}
            </span>
            <span className="text-sm text-[var(--slate)]">{date}</span>
          </div>

          <h3 className="text-[1.25rem] font-medium text-[var(--ink)] leading-[1.3] mb-3 group-hover:text-[var(--navy)] transition-colors">
            {title}
          </h3>

          <p className="text-[var(--ink-soft)] text-sm leading-[1.6] line-clamp-3 mb-6">
            {excerpt}
          </p>

          <div className="mt-auto flex items-center text-sm font-medium text-[var(--navy)]">
            Read article
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </a>
    );
  }
);
ArticleCard.displayName = "ArticleCard";

export { ArticleCard };
