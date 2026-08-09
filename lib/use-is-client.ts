"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True once the component has hydrated, false during server rendering.
 *
 * Used where output genuinely depends on the browser (the visitor's timezone,
 * sessionStorage) and would otherwise cause a hydration mismatch. The obvious
 * alternative, setting state inside an effect, trips
 * react-hooks/set-state-in-effect and causes a second render pass; this reads
 * the value during the first client render instead.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
