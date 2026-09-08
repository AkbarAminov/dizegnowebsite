"use client";

import { useEffect } from "react";
import { Check, TriangleAlert } from "lucide-react";

export type ToastMessage = { text: string; tone: "success" | "error" } | null;

// Optimistic actions (publish, reorder, delete) change the UI instantly, so
// this is the only thing that tells the user the server agreed.
export function Toast({ message, onDismiss }: { message: ToastMessage; onDismiss: () => void }) {
  useEffect(() => {
    if (!message || message.tone === "error") return;
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const isError = message.tone === "error";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm shadow-2xl backdrop-blur ${
        isError
          ? "border-red-500/40 bg-red-950/90 text-red-200"
          : "border-white/15 bg-neutral-900/95 text-neutral-100"
      }`}
    >
      {isError ? <TriangleAlert size={16} className="shrink-0" /> : <Check size={16} className="shrink-0 text-green-400" />}
      <span>{message.text}</span>
      {isError && (
        <button type="button" onClick={onDismiss} className="ml-2 text-xs text-red-300 underline hover:text-red-100">
          Dismiss
        </button>
      )}
    </div>
  );
}
