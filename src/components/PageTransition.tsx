"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

// Fade/rise-in on every route change: keying by pathname remounts the
// wrapper, which replays the CSS animation. The very first paint is left
// alone so server-rendered content shows immediately.
//
// Deliberately CSS rather than Framer Motion, and deliberately no exit
// animation. In the App Router the outgoing element already holds the *new*
// page (the layout's children swap in place), so an exit fade only blanks
// the next page for half a second; and a JS-driven entrance keeps the page
// at opacity 0 until the main thread is free, which on a busy first load
// looks like a black screen. A CSS animation's resting state is visible
// no matter what.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // "Have we navigated since the first render?" — derived during render
  // from the previous pathname, the documented pattern for state that
  // depends on a prop changing.
  const [lastPathname, setLastPathname] = useState(pathname);
  const [navigated, setNavigated] = useState(false);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setNavigated(true);
  }

  return (
    <div key={pathname} className={navigated ? "animate-page-in" : undefined}>
      {children}
    </div>
  );
}
