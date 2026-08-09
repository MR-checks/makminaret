"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export type QuoteRequestFormProps = React.HTMLAttributes<HTMLFormElement>;

const QuoteRequestForm = React.forwardRef<HTMLFormElement, QuoteRequestFormProps>(
  ({ className, ...props }, ref) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Form submission logic would go here
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col gap-6 rounded-md border border-[var(--rule)] bg-[var(--paper-raised)] p-6 md:p-8",
          className
        )}
        {...props}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="qr-firstName">First Name</Label>
            <Input id="qr-firstName" placeholder="Kwame" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qr-lastName">Last Name</Label>
            <Input id="qr-lastName" placeholder="Mensah" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="qr-email">Email Address</Label>
            <Input id="qr-email" type="email" placeholder="kwame@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qr-phone">Phone Number</Label>
            <PhoneInput id="qr-phone" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="qr-message">How can we help you?</Label>
          <Textarea
            id="qr-message"
            placeholder="Tell us about the program you are interested in..."
            className="min-h-[120px]"
            required
          />
        </div>

        <div className="pt-2 border-t border-[var(--rule)] mt-2">
          <Button type="submit" size="lg" className="w-full md:w-auto">
            Request Quote
          </Button>
          <p className="text-xs text-[var(--slate)] font-mono mt-4 text-center md:text-left">
            We typically respond within 24 hours.
          </p>
        </div>
      </form>
    );
  }
);
QuoteRequestForm.displayName = "QuoteRequestForm";

export { QuoteRequestForm };
