"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  value: string | undefined;
  onValueChange: (value: string) => void;
}>({ value: undefined, onValueChange: () => {} });

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | undefined>(
      defaultValue
    );

    const currentValue = value !== undefined ? value : internalValue;
    const setCurrentValue = React.useCallback(
      (newValue: string) => {
        if (onValueChange) onValueChange(newValue);
        if (value === undefined) setInternalValue(newValue);
      },
      [onValueChange, value]
    );

    return (
      <TabsContext.Provider
        value={{ value: currentValue, onValueChange: setCurrentValue }}
      >
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-[var(--sand)] p-1 text-[var(--slate)]",
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-[var(--paper)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-white text-[var(--ink)] shadow-sm border border-[var(--rule)]"
          : "hover:text-[var(--ink)] hover:bg-[var(--paper-raised)]",
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const { value: selectedValue } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn(
        "mt-2 ring-offset-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
