import React from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/content/reader";
import { FOOTER_COLUMNS, LEGAL_LINKS } from "@/lib/navigation";
import { OfficeHours } from "./OfficeHours";

/**
 * Footer (MASTERPLAN §2.5). Four columns plus a legal bar.
 *
 * A server component reading everything from content/settings.json. It once
 * hardcoded the Ankara address, the MERSİS number, a +90 phone and the office
 * hours directly in JSX, which HANDOVER §3.1 rules out: that is precisely how
 * a fake value survives to launch. Anything still unconfirmed is simply not
 * rendered rather than shown as a plausible-looking placeholder.
 *
 * Publishing the registration number is a deliberate trust move. Fraudulent
 * agencies do not do it.
 */
export async function Footer() {
  const settings = await getSiteSettings();
  const address = (settings?.officeAddress ?? []).filter(Boolean);
  const socials = (settings?.socials ?? []).filter((s) => s.url);

  return (
    <footer className="on-dark border-t border-gold/20 bg-navy-deep px-4 py-16 text-paper md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {FOOTER_COLUMNS.map((column, i) => (
            <div key={column.heading} className="flex flex-col gap-4">
              {i === 0 ? (
                <>
                  <Image
                    src="/logo-white.svg"
                    alt="Minaret Educational Consultancy"
                    width={160}
                    height={117}
                    className="h-12 w-auto self-start object-contain"
                  />
                  <h2 className="sr-only">{column.heading}</h2>
                </>
              ) : (
                <h2 className="mb-2 font-display text-xl font-bold text-paper">
                  {column.heading}
                </h2>
              )}
              <ul className="flex flex-col gap-2 font-sans text-sm text-paper/80">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            <h2 className="mb-2 font-display text-xl font-bold text-paper">
              Get in touch
            </h2>
            <div className="flex flex-col gap-4 font-sans text-sm text-paper/80">
              {address.length > 0 && (
                <p className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-gold"
                  />
                  <span>
                    {address.map((line, i) => (
                      <React.Fragment key={line}>
                        {line}
                        {i < address.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </span>
                </p>
              )}

              {settings?.whatsappNumber && (
                <p className="flex items-center gap-2">
                  <MessageCircle
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-gold"
                  />
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hi, I would like to ask about studying in Türkiye.")}`}
                    className="transition-colors hover:text-gold"
                  >
                    {settings.primaryPhone} (WhatsApp)
                  </a>
                </p>
              )}

              {settings?.officePhone && (
                <p className="flex items-center gap-2">
                  <Phone size={16} aria-hidden="true" className="shrink-0 text-gold" />
                  <a
                    href={`tel:${settings.officePhone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-gold"
                  >
                    {settings.officePhone} (Ankara)
                  </a>
                </p>
              )}

              {settings?.email && (
                <p className="flex items-center gap-2">
                  <Mail size={16} aria-hidden="true" className="shrink-0 text-gold" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="transition-colors hover:text-gold"
                  >
                    {settings.email}
                  </a>
                </p>
              )}

              {settings?.officeHours && <OfficeHours hours={settings.officeHours} />}

              {socials.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-4">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      className="font-sans text-xs text-paper/80 transition-colors hover:text-gold"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-8 font-sans text-xs text-paper/75 md:flex-row">
          <p>
            © {new Date().getFullYear()} {settings?.legalName ?? "MAK Minaret"}.
            Registered in Türkiye
            {settings?.registrationNumber
              ? `, Tax/MERSİS No: ${settings.registrationNumber}`
              : ""}
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
