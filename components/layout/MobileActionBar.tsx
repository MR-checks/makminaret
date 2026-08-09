"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";

/**
 * Sticky mobile action bar (MASTERPLAN §4.1).
 *
 * Appears after 25% scroll depth. Deliberately a bottom-anchored bar rather
 * than a floating circular bubble in the corner, which reads as a template
 * widget and is on the banned list in §6.2.
 *
 * This is one of the few elements permitted a shadow (HANDOVER §1.2).
 */
export function MobileActionBar({
  phone,
  waHref,
}: {
  phone?: string | null;
  waHref?: string | null;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      setVisible(window.scrollY / scrollable > 0.25);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper shadow-md lg:hidden">
      <div className="flex items-center gap-2 p-3">
        {waHref && (
          <a
            href={waHref}
            className="flex min-h-11 flex-1 flex-col items-center justify-center rounded-sm text-slate transition-colors hover:text-navy"
            aria-label="Message us on WhatsApp"
          >
            <MessageCircle size={20} aria-hidden="true" />
            <span className="font-sans text-[10px] font-medium">WhatsApp</span>
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex min-h-11 flex-1 flex-col items-center justify-center rounded-sm text-slate transition-colors hover:text-navy"
            aria-label="Call us"
          >
            <Phone size={20} aria-hidden="true" />
            <span className="font-sans text-[10px] font-medium">Call</span>
          </a>
        )}
        <Link
          href="/eligibility"
          className="flex min-h-11 flex-[2] items-center justify-center gap-2 rounded-sm bg-seal px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90"
        >
          Check eligibility
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
