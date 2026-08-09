"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useIsClient } from "@/lib/use-is-client";

/**
 * Showcase-mode preview bar (HANDOVER §3.4).
 *
 * Rendered only when SITE_MODE=showcase, which the server layout decides so
 * this component never reads env directly. Dismissal persists for the session.
 */
export function PreviewBar() {
  const isClient = useIsClient();
  const [dismissedThisRender, setDismissedThisRender] = useState(false);

  const dismissedEarlier =
    isClient && sessionStorage.getItem("minaret:preview-bar") === "dismissed";

  if (!isClient || dismissedEarlier || dismissedThisRender) return null;

  return (
    <div className="bg-navy-deep on-dark text-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 md:px-8">
        <p className="font-mono text-[0.8125rem] tracking-[0.04em]">
          Preview build. Content shown is illustrative.
        </p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem("minaret:preview-bar", "dismissed");
            setDismissedThisRender(true);
          }}
          aria-label="Dismiss preview notice"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-sm transition-colors hover:bg-paper/10"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
