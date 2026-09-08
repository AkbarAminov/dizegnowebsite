// Shared admin styles and a tiny fetch wrapper for the /api/admin routes.

export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";

export const inputClass =
  `w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-100 outline-none transition-colors placeholder:text-neutral-500 hover:border-white/25 focus:border-white/50 focus:bg-white/[0.07] disabled:opacity-50 ${focusRing}`;

export const invalidInputClass = "border-red-500/60 focus:border-red-500";

export const primaryButtonClass =
  `inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

export const secondaryButtonClass =
  `inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm text-neutral-300 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

export const dangerButtonClass =
  `inline-flex items-center gap-2 rounded-md border border-red-500/30 px-4 py-2 text-sm text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50 ${focusRing}`;

export const iconButtonClass =
  `rounded p-1.5 text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-100 ${focusRing}`;

/** Panel that groups one topic of a form. */
export const cardClass = "rounded-xl border border-white/10 bg-panel";

export const labelClass = "text-sm font-medium text-neutral-200";

export const hintClass = "text-xs text-neutral-500";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function api<T = unknown>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown
): Promise<ApiResult<T>> {
  const isForm = body instanceof FormData;
  const res = await fetch(path.endsWith("/") ? path : `${path}/`, {
    method,
    headers: isForm || body === undefined ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : body === undefined ? undefined : JSON.stringify(body),
  }).catch(() => null);

  if (!res) return { ok: false, error: "Network error" };
  const data = await res.json().catch(() => null);
  if (res.ok) return { ok: true, data: data as T };
  return { ok: false, error: data?.error ?? `Request failed (${res.status})` };
}
