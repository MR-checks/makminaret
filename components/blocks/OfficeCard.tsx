import * as React from "react";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail } from "lucide-react";

export interface OfficeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  imageSrc?: string;
}

const OfficeCard = React.forwardRef<HTMLDivElement, OfficeCardProps>(
  ({ className, city, country, address, phone, email, imageSrc, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col overflow-hidden rounded-md border border-[var(--rule)] bg-[var(--paper)]",
          className
        )}
        {...props}
      >
        <div className="relative h-48 w-full bg-[var(--paper-raised)] border-b border-[var(--rule)]">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={`${city} office`}
              className="h-full w-full object-cover grayscale"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--slate)] font-mono text-sm">
              [TODO: Office Exterior]
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-6">
            <h3 className="font-display text-[1.5rem] text-[var(--ink)] leading-none mb-1">
              {city}
            </h3>
            <span className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-[var(--slate)]">
              {country}
            </span>
          </div>

          <ul className="flex flex-col gap-4 text-sm text-[var(--ink-soft)] mt-auto">
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-[var(--navy)] mt-0.5" />
              <span className="leading-[1.4] whitespace-pre-line">{address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-[var(--navy)]" />
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="hover:text-[var(--navy)] transition-colors"
              >
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-[var(--navy)]" />
              <a
                href={`mailto:${email}`}
                className="hover:text-[var(--navy)] transition-colors"
              >
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
);
OfficeCard.displayName = "OfficeCard";

export { OfficeCard };
