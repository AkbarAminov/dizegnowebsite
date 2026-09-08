"use client";

import { useSyncExternalStore } from "react";

// Server and browser sit in different time zones, so formatting a date while
// rendering mismatches on hydration. Both sides render the same UTC label
// first; once mounted, the viewer's own locale takes over.
function utcLabel(iso: string, withTime: boolean) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
  }).format(new Date(iso));
}

const subscribe = () => () => {};

export function LocalTime({ iso, withTime = false }: { iso: string; withTime?: boolean }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const date = new Date(iso);
  const label = mounted ? (withTime ? date.toLocaleString() : date.toLocaleDateString()) : utcLabel(iso, withTime);

  return (
    <time dateTime={iso} suppressHydrationWarning>
      {label}
    </time>
  );
}
