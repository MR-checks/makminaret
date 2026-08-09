"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Phone, ArrowRight } from "lucide-react";

export interface MobileActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryHref?: string;
  secondaryHref?: string;
}

const MobileActionBar = React.forwardRef<HTMLDivElement, MobileActionBarProps>(
  (
    {
      className,
      primaryLabel = "Apply Now",
      secondaryLabel = "WhatsApp",
      primaryHref = "#",
      secondaryHref = "#",
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const handleScroll = () => {
        // Appears after ~25% scroll down
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 25% of scrollable height
        const triggerPoint = (documentHeight - windowHeight) * 0.25;

        setIsVisible(scrollPosition > triggerPoint);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--paper)] border-t border-[var(--rule)] p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "translate-y-full",
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          <a
            href={secondaryHref}
            className="flex-1 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-140 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] rounded-md bg-[#25D366] text-white hover:bg-[#1EBE5D] h-10 px-4 py-2"
          >
            <Phone className="mr-2 h-4 w-4" />
            {secondaryLabel}
          </a>
          <a
            href={primaryHref}
            className="flex-1 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-140 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] rounded-md bg-[var(--navy)] text-white hover:bg-[var(--navy-deep)] h-10 px-4 py-2"
          >
            {primaryLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }
);
MobileActionBar.displayName = "MobileActionBar";

export { MobileActionBar };
