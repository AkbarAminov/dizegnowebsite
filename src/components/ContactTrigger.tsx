"use client";

import { useContactPopup } from "./ContactPopup";

// A button that opens the shared contact modal, so server-rendered sections
// (hero, services) can offer the same CTA as the floating "+" button.
export function ContactTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  const { setOpen } = useContactPopup();
  return (
    <button type="button" onClick={() => setOpen(true)} className={className}>
      {children}
    </button>
  );
}
