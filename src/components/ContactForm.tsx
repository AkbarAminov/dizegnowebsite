"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import { primaryCtaClass } from "./buttons";

type Status = "idle" | "submitting" | "success" | "error";
type FieldName = "name" | "email" | "phone" | "message";
type FieldErrors = Partial<Record<FieldName, string[]>>;

export function ContactForm({ dict }: { dict: Dictionary["contact"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      const body = await res.json().catch(() => ({}));
      setFieldErrors(body.fieldErrors ?? {});
    } catch {
      // Network failure: fall through to the generic error state.
    }
    setStatus("error");
  }

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status">
        <p className="text-lg">{dict.formSuccess}</p>
        <p className="mt-2 max-w-sm text-sm opacity-70">{dict.formSuccessHint}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      <Field name="name" label={dict.formName} autoComplete="name" errors={fieldErrors.name} required />
      <Field name="email" label={dict.formEmail} type="email" autoComplete="email" errors={fieldErrors.email} required />
      <Field name="phone" label={dict.formPhone} type="tel" autoComplete="tel" hint={dict.formPhoneHint} errors={fieldErrors.phone} />
      <Field name="message" label={dict.formMessage} as="textarea" hint={dict.formMessageHint} errors={fieldErrors.message} required />

      {status === "error" && Object.keys(fieldErrors).length === 0 && (
        <p className="text-sm text-red-500" role="alert">
          {dict.formError}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <button type="submit" disabled={status === "submitting"} className={`${primaryCtaClass} w-fit disabled:opacity-50`}>
          {status === "submitting" ? dict.formSubmitting : dict.formSubmit}
        </button>
        <p className="max-w-xs text-xs opacity-50">{dict.privacyNote}</p>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  as = "input",
  autoComplete,
  hint,
  errors,
  required = false,
}: {
  name: FieldName;
  label: string;
  type?: string;
  as?: "input" | "textarea";
  autoComplete?: string;
  hint?: string;
  errors?: string[];
  required?: boolean;
}) {
  const inputClass =
    "border-b border-current/30 bg-transparent py-2 outline-none transition-colors focus:border-current";

  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="uppercase tracking-tight opacity-70">{label}</span>
      {as === "textarea" ? (
        <textarea name={name} rows={4} required={required} className={inputClass} />
      ) : (
        <input name={name} type={type} autoComplete={autoComplete} required={required} className={inputClass} />
      )}
      {hint && !errors?.length && <span className="text-xs opacity-50">{hint}</span>}
      {errors?.map((error) => (
        <span key={error} className="text-red-500">
          {error}
        </span>
      ))}
    </label>
  );
}
