"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * FAQ accordion. Height eases over 200ms per MASTERPLAN §6.8, and the panel is
 * a real disclosure: button controls region, aria-expanded reflects state.
 */
export function FaqAccordion({
  items,
}: {
  items: Array<{ slug: string; question: string; answer: string }>;
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.slug ?? null);

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {items.map((item) => {
        const isOpen = open === item.slug;
        return (
          <div key={item.slug}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.slug)}
                aria-expanded={isOpen}
                aria-controls={`faq-${item.slug}`}
                className="flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left font-sans font-medium text-navy"
              >
                {item.question}
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={`shrink-0 text-slate transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={`faq-${item.slug}`}
              hidden={!isOpen}
              className="pb-5 font-sans leading-relaxed text-ink-soft"
            >
              <p className="max-prose">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
