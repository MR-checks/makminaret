import React from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";

/**
 * WhatsApp is the primary channel for this audience (MASTERPLAN §4.1), so
 * every link carries context-aware prefilled text. That tells the sales team
 * where a lead came from with no tracking infrastructure at all.
 */
export function whatsappHref(context: string, whatsappNumber = "233240101057") {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(context)}`;
}

export function WhatsAppLink({
  context,
  className = "",
  children,
}: {
  context: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={whatsappHref(context)}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-[var(--whatsapp)] px-6 font-sans text-sm font-medium text-white transition-colors hover:bg-[var(--whatsapp-hover)] ${className}`}
    >
      <MessageCircle size={18} aria-hidden="true" />
      {children ?? "Message us on WhatsApp"}
    </a>
  );
}

/**
 * Closing conversion panel. Three ways to reach a human, per MASTERPLAN §3.1
 * section 10.
 */
export function CtaPanel({
  heading = "Find out where you stand.",
  body = "Nine questions, about two minutes, and an honest answer at the end. Free, and you do not need any documents yet.",
  context = "Hi, I would like to ask about studying in Türkiye.",
}: {
  heading?: string;
  body?: string;
  context?: string;
}) {
  return (
    <section className="on-dark bg-navy-deep px-6 py-16 text-paper md:py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-2xl font-display text-3xl tracking-tight md:text-4xl">
          {heading}
        </h2>
        <p className="mt-4 max-w-2xl font-sans leading-relaxed text-paper/85">{body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/eligibility"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-seal px-6 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90"
          >
            Check your eligibility
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <WhatsAppLink context={context} />
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-paper/30 px-6 font-sans text-sm font-medium text-paper transition-colors hover:bg-paper/10"
          >
            Contact the office
          </Link>
        </div>
      </div>
    </section>
  );
}
