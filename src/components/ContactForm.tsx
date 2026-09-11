"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string[]>>;

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
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-lg">
        {dict.formSuccess}
      </motion.p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      <Field name="name" label={dict.formName} errors={fieldErrors.name} />
      <Field name="email" label={dict.formEmail} type="email" errors={fieldErrors.email} />
      <Field name="message" label={dict.formMessage} as="textarea" errors={fieldErrors.message} />

      {status === "error" && Object.keys(fieldErrors).length === 0 && (
        <p className="text-sm text-red-500">{dict.formError}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-fit border border-accent px-6 py-3 text-sm uppercase tracking-tight text-accent transition-colors duration-200 hover:bg-accent hover:text-black disabled:opacity-50"
      >
        {status === "submitting" ? dict.formSubmitting : dict.formSubmit}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  as = "input",
  errors,
}: {
  name: string;
  label: string;
  type?: string;
  as?: "input" | "textarea";
  errors?: string[];
}) {
  const inputClass =
    "border-b border-current/30 bg-transparent py-2 outline-none transition-colors focus:border-current";

  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="uppercase tracking-tight opacity-70">{label}</span>
      {as === "textarea" ? (
        <textarea name={name} rows={4} required className={inputClass} />
      ) : (
        <input name={name} type={type} required className={inputClass} />
      )}
      {errors?.map((error) => (
        <span key={error} className="text-red-500">
          {error}
        </span>
      ))}
    </label>
  );
}
