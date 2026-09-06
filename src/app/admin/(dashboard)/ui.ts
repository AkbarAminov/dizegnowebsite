// Shared admin styles and a tiny fetch wrapper for the /api/admin routes.

export const inputClass =
  "w-full rounded border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-white/40";

export const primaryButtonClass =
  "rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50";

export const secondaryButtonClass =
  "rounded border border-white/15 px-4 py-2 text-sm text-neutral-400 hover:border-white/30 hover:text-neutral-100 disabled:opacity-50";

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
