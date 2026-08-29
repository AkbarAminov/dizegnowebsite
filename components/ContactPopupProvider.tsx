"use client";

import { createContext, useContext, useState } from "react";

type ContactPopupContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ContactPopupContext = createContext<ContactPopupContextValue | null>(null);

// Shared so both the floating "+" button and the EndCTA link can open
// the same modal instead of each having their own disconnected copy.
export function ContactPopupProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ContactPopupContext.Provider value={{ open, setOpen }}>
      {children}
    </ContactPopupContext.Provider>
  );
}

export function useContactPopup() {
  const ctx = useContext(ContactPopupContext);
  if (!ctx) throw new Error("useContactPopup must be used within ContactPopupProvider");
  return ctx;
}
