"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { inputClass, primaryButtonClass } from "../(dashboard)/ui";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-neutral-100">
      <form action={action} className="w-full max-w-sm rounded-lg border border-white/10 bg-panel p-8">
        <h1 className="text-xl font-semibold">Admin sign in</h1>
        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-neutral-400">Email</span>
            <input name="email" type="email" required autoComplete="username" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-neutral-400">Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </label>
          {state.error && <p className="text-sm text-red-400">{state.error}</p>}
          <button type="submit" disabled={pending} className={`mt-2 ${primaryButtonClass}`}>
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
