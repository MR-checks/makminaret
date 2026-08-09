"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Search } from "lucide-react";

export interface ProgramFilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: (term: string) => void;
  onDegreeChange?: (degree: string) => void;
  onLanguageChange?: (language: string) => void;
}

const ProgramFilterBar = React.forwardRef<HTMLDivElement, ProgramFilterBarProps>(
  ({ className, onSearch, onDegreeChange, onLanguageChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-4 sm:flex-row p-4 border border-[var(--rule)] bg-[var(--paper-raised)] rounded-md",
          className
        )}
        {...props}
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--slate)]">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="search"
            placeholder="Search programs..."
            className="pl-9"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        <div className="flex gap-4 sm:w-[300px]">
          <Select
            defaultValue=""
            onChange={(e) => onDegreeChange?.(e.target.value)}
            aria-label="Filter by degree"
          >
            <option value="" disabled hidden>
              Degree
            </option>
            <option value="all">All Degrees</option>
            <option value="bachelors">Bachelor&apos;s</option>
            <option value="masters">Master&apos;s</option>
            <option value="phd">PhD</option>
          </Select>
          <Select
            defaultValue=""
            onChange={(e) => onLanguageChange?.(e.target.value)}
            aria-label="Filter by language"
          >
            <option value="" disabled hidden>
              Language
            </option>
            <option value="all">All Languages</option>
            <option value="english">English</option>
            <option value="turkish">Turkish</option>
          </Select>
        </div>
      </div>
    );
  }
);
ProgramFilterBar.displayName = "ProgramFilterBar";

export { ProgramFilterBar };
