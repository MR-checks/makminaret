"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ChevronDown, MessageCircle, Phone, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";

/**
 * Full-screen mobile drawer (MASTERPLAN §2.2). Education first and expanded by
 * default, because that is the primary business and the primary intent.
 *
 * Focus is moved into the drawer on open and returned on close, and Tab is
 * trapped inside while it is open.
 */
export function MobileDrawer({
  open,
  onClose,
  phone,
  waHref,
}: {
  open: boolean;
  onClose: () => void;
  phone?: string | null;
  waHref?: string | null;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<string | null>(NAV_ITEMS[0]?.label ?? null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-paper lg:hidden"
    >
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
          Menu
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid h-11 w-11 place-items-center rounded-sm text-navy transition-colors hover:bg-sand"
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Mobile" className="flex-1 px-4 py-4">
        <Link
          href="/eligibility"
          onClick={onClose}
          className="mb-6 flex min-h-11 items-center justify-center gap-2 rounded-sm bg-seal px-5 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90"
        >
          Check your eligibility
          <ArrowRight size={16} aria-hidden="true" />
        </Link>

        <ul className="flex flex-col">
          {NAV_ITEMS.map((item) => {
            if (item.kind === "link") {
              return (
                <li key={item.label} className="border-b border-rule">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex min-h-11 items-center py-3 font-sans text-base font-medium text-navy"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            const isOpen = expanded === item.label;
            const links =
              item.kind === "mega" ? item.columns.flatMap((c) => c.links) : item.links;

            return (
              <li key={item.label} className="border-b border-rule">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  aria-expanded={isOpen}
                  className="flex min-h-11 w-full items-center justify-between py-3 text-left font-sans text-base font-medium text-navy"
                >
                  {item.label}
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <ul className="flex flex-col pb-3">
                    {item.kind === "mega"
                      ? item.columns.map((column) => (
                          <li key={column.heading} className="mt-2">
                            <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                              {column.heading}
                            </p>
                            <ul className="mt-1 flex flex-col">
                              {column.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className="flex min-h-11 items-center py-1 font-sans text-sm text-ink-soft"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))
                      : links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              onClick={onClose}
                              className="flex min-h-11 items-center py-1 font-sans text-sm text-ink-soft"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          {waHref && (
            <a
              href={waHref}
              className="flex min-h-11 items-center justify-center gap-2 rounded-sm bg-[var(--whatsapp)] px-5 font-sans text-sm font-medium text-white"
            >
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex min-h-11 items-center justify-center gap-2 rounded-sm border border-navy px-5 font-sans text-sm font-medium text-navy"
            >
              <Phone size={18} aria-hidden="true" /> {phone}
            </a>
          )}
        </div>
      </nav>
    </div>
  );
}
