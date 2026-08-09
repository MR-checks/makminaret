"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const AccordionContext = React.createContext<{
  openValue: string | undefined;
  onValueChange: (value: string | undefined) => void;
}>({ openValue: undefined, onValueChange: () => {} });

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"; // Kept simple, actually only doing single for this custom one
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  defaultValue?: string;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, value, onValueChange, defaultValue, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | undefined>(
      defaultValue
    );

    const openValue = value !== undefined ? value : internalValue;
    const setOpenValue = React.useCallback(
      (newValue: string | undefined) => {
        if (onValueChange) onValueChange(newValue);
        if (value === undefined) setInternalValue(newValue);
      },
      [onValueChange, value]
    );

    return (
      <AccordionContext.Provider value={{ openValue, onValueChange: setOpenValue }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

const AccordionItemContext = React.createContext<{ value: string; isOpen: boolean }>({
  value: "",
  isOpen: false,
});

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const { openValue } = React.useContext(AccordionContext);
  const isOpen = openValue === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        ref={ref}
        className={cn("border-b border-[var(--rule)]", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { onValueChange } = React.useContext(AccordionContext);
  const { value, isOpen } = React.useContext(AccordionItemContext);

  return (
    <div className="flex">
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:text-[var(--navy)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2 [&[aria-expanded=true]>svg]:rotate-180",
          className
        )}
        onClick={() => onValueChange(isOpen ? undefined : value)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-[var(--slate)] transition-transform duration-200" />
      </button>
    </div>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(AccordionItemContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | undefined>(isOpen ? undefined : 0);

  React.useEffect(() => {
    if (isOpen) {
      setHeight(contentRef.current?.scrollHeight);
      const timeoutId = setTimeout(() => setHeight(undefined), 200); // matches duration-200
      return () => clearTimeout(timeoutId);
    } else {
      setHeight(contentRef.current?.scrollHeight);
      // Force reflow
      void contentRef.current?.offsetHeight;
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      className="overflow-hidden text-sm transition-[height] duration-200 ease-in-out"
      style={{ height: height !== undefined ? height : "auto" }}
      {...props}
    >
      <div ref={contentRef} className={cn("pb-4 pt-0 text-[var(--ink-soft)]", className)}>
        {children}
      </div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
