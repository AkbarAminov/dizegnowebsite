"use client";

import { useContactPopup } from "./ContactPopup";

export function EndCTA() {
  const { setOpen } = useContactPopup();

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-black px-6 py-24 text-center">
      <div className="max-w-4xl text-2xl font-bold uppercase tracking-tight md:text-5xl">
        <p className="text-white">You made it to the end —</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mx-auto mt-2 block max-w-3xl cursor-pointer uppercase text-accent transition-opacity duration-200 hover:opacity-70"
        >
          Let&apos;s talk about your project instead
        </button>
      </div>
    </div>
  );
}
