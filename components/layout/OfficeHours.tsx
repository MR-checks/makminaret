"use client";

import { useIsClient } from "@/lib/use-is-client";

/**
 * Converts the Ankara office hours into the visitor's own timezone
 * (MASTERPLAN §4.1). Computed on the client, because it depends on the
 * visitor's locale and would otherwise mismatch on hydration.
 *
 * This converts a fixed daily window rather than counting down to a date, so
 * it does not go stale in the way HANDOVER §4.1 rules out.
 */
export function OfficeHours({ hours }: { hours: string }) {
  const isClient = useIsClient();

  let local: string | null = null;
  if (isClient) {
    try {
      const format = (hourInAnkara: number) => {
        const d = new Date();
        d.setUTCHours(hourInAnkara - 3, 0, 0, 0); // Ankara is GMT+3
        return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      };
      local = `which is ${format(9)} to ${format(18)} your time`;
    } catch {
      local = null;
    }
  }

  return (
    // `on-dark` declares that this fragment is only ever rendered onto a navy
    // surface, which is what makes the gold below legitimate at 6.32:1.
    <div className="on-dark mt-2 text-xs text-paper/75 p-3 bg-paper/5 border border-paper/10 rounded-sm">
      Office hours: {hours}
      {local && <span className="block mt-1 text-gold">{local}</span>}
    </div>
  );
}
