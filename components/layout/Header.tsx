"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, MessageCircle, Phone } from "lucide-react";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { MobileDrawer } from "./MobileDrawer";

/**
 * Header (MASTERPLAN §2.2, §2.3, HANDOVER §1.8).
 *
 * Sticky rather than fixed, so it occupies its own space in flow: a fixed
 * header covered the showcase preview bar and forced main to carry a hardcoded
 * offset that drifted whenever the header changed height.
 */

/**
 * The one blur on the site. HANDOVER §1.4 rejects glassmorphism everywhere
 * except the sticky header once scrolled, where a translucent background with
 * a light blur is a functional legibility treatment rather than decoration.
 */
const SCROLLED_HEADER_CLASS = "bg-navy/95 backdrop-blur-sm border-b border-paper/10"; // constraint-ok: HANDOVER §1.4 sticky-header exception

export function Header({
  phone,
  whatsappNumber,
  legalName,
  registrationNumber,
}: {
  phone?: string | null;
  whatsappNumber?: string | null;
  legalName?: string | null;
  registrationNumber?: string | null;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Menu state is stamped with the route it was opened on, so a navigation
  // closes it by derivation rather than by a setState in an effect. Same
  // result, one render pass fewer, and no cascading update.
  const [menus, setMenus] = useState<{
    path: string;
    active: string | null;
    drawer: boolean;
  }>({ path: pathname, active: null, drawer: false });

  const onCurrentRoute = menus.path === pathname;
  const activeMenu = onCurrentRoute ? menus.active : null;
  const drawerOpen = onCurrentRoute ? menus.drawer : false;

  const setActiveMenu = (active: string | null) =>
    setMenus({ path: pathname, active, drawer: false });
  const setDrawerOpen = (drawer: boolean) =>
    setMenus({ path: pathname, active: null, drawer });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    // Deferred rather than called inline: a synchronous setState in an effect
    // body triggers a cascading render. This still catches a page that loads
    // already scrolled, on the next frame.
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close on click outside or Escape. Route changes are handled by derivation
  // above.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I would like to ask about studying in Türkiye.")}`
    : null;

  return (
    <>
      <header
        ref={headerRef}
        className={`on-dark sticky top-0 z-50 flex flex-col transition-colors duration-300 ${
          isScrolled ? SCROLLED_HEADER_CLASS : "bg-navy"
        }`}
      >
        {/* Utility bar (§2.2): legal entity and registration on the left, the
            contact affordances on the right. */}
        <div className="bg-navy-deep font-mono text-[0.75rem] tracking-[0.04em] text-paper/80">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-1.5 md:px-8">
            <p className="truncate">
              {legalName ?? "MAK Minaret"}
              {registrationNumber ? ` · Reg. ${registrationNumber}` : ""}
            </p>
            <div className="flex shrink-0 items-center gap-4">
              {waHref && (
                <a
                  href={waHref}
                  className="flex items-center gap-1 transition-colors hover:text-gold"
                >
                  <MessageCircle size={12} aria-hidden="true" /> WhatsApp
                </a>
              )}
              {phone && (
                <>
                  <span aria-hidden="true" className="hidden text-paper/40 sm:inline">
                    |
                  </span>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="hidden items-center gap-1 transition-colors hover:text-gold sm:flex"
                  >
                    <Phone size={12} aria-hidden="true" /> {phone}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        <nav
          aria-label="Main"
          className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-4 py-3 md:px-8"
        >
          <Link href="/" className="shrink-0" aria-label="Minaret, home">
            <Image
              src="/logo-white.svg"
              alt="Minaret Educational Consultancy"
              width={160}
              height={117}
              priority
              className="h-11 w-auto object-contain"
            />
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavSlot
                key={item.label}
                item={item}
                open={activeMenu === item.label}
                onToggle={() =>
                  setActiveMenu(activeMenu === item.label ? null : item.label)
                }
                onNavigate={() => setActiveMenu(null)}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/eligibility"
              className="hidden min-h-11 items-center justify-center gap-2 rounded-sm bg-seal px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90 lg:inline-flex"
            >
              Check your eligibility
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              className="grid h-11 w-11 place-items-center rounded-sm text-paper transition-colors hover:bg-paper/10 lg:hidden"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        phone={phone}
        waHref={waHref}
      />
    </>
  );
}

function NavSlot({
  item,
  open,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  if (item.kind === "link") {
    return (
      <Link
        href={item.href}
        className="rounded-sm font-sans text-sm font-medium text-paper transition-colors hover:text-gold"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 rounded-sm font-sans text-sm font-medium text-paper transition-colors hover:text-gold"
      >
        {item.label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform duration-[160ms] ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && item.kind === "mega" && (
        <div className="absolute left-1/2 top-full z-50 mt-4 w-[min(72rem,calc(100vw-4rem))] -translate-x-1/2 rounded-md border border-rule bg-paper p-8 shadow-md">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
            {item.columns.map((column) => (
              <div key={column.heading}>
                <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-slate">
                  {column.heading}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        className="font-sans text-sm text-ink transition-colors hover:text-seal"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {item.promo && (
              <div className="rounded-md border border-rule bg-sand p-5">
                <p className="font-display text-lg text-navy">{item.promo.heading}</p>
                <ul className="mt-3 flex flex-col gap-1">
                  {item.promo.lines.map((line) => (
                    <li
                      key={line}
                      className="font-mono text-[0.8125rem] tracking-[0.04em] text-slate"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
                <Link
                  href={item.promo.cta.href}
                  onClick={onNavigate}
                  className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-seal px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90"
                >
                  {item.promo.cta.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {open && item.kind === "dropdown" && (
        <div className="absolute left-0 top-full z-50 mt-4 w-64 rounded-md border border-rule bg-paper py-2 shadow-md">
          <ul>
            {item.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className="block px-4 py-2 font-sans text-sm text-ink transition-colors hover:bg-sand hover:text-seal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
