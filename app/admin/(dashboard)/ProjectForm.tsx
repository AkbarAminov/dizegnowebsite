"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectInput } from "@/lib/validation";
import { api, inputClass, primaryButtonClass } from "./ui";

type FieldRow = { label: string; value: string };

export type ProjectFormValues = {
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string;
  production: string;
  fields: FieldRow[];
};

const EMPTY: ProjectFormValues = {
  title: "",
  slug: "",
  category: "",
  year: "",
  description: "",
  production: "",
  fields: [],
};

export function ProjectForm({
  projectId,
  initial = EMPTY,
  categories,
}: {
  // Absent when creating a new project.
  projectId?: string;
  initial?: ProjectFormValues;
  categories: string[];
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function updateField(index: number, patch: Partial<FieldRow>) {
    set(
      "fields",
      values.fields.map((field, i) => (i === index ? { ...field, ...patch } : field))
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload: ProjectInput = {
      ...values,
      year: values.year ? Number(values.year) : null,
      // Rows left completely blank are dropped rather than rejected.
      fields: values.fields.filter((field) => field.label.trim() || field.value.trim()),
    };

    const result = projectId
      ? await api(`/api/admin/projects/${projectId}`, "PATCH", payload)
      : await api<{ id: string }>("/api/admin/projects", "POST", payload);

    if (!result.ok) {
      setError(result.error);
      setSaving(false);
      return;
    }

    if (projectId) {
      router.refresh();
      setSaving(false);
    } else {
      router.push(`/admin/projects/${(result.data as { id: string }).id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Title">
        <input value={values.title} onChange={(e) => set("title", e.target.value)} required className={inputClass} />
      </Field>
      <Field label="Slug">
        <input
          value={values.slug}
          onChange={(e) => set("slug", e.target.value)}
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="Lowercase letters, digits and hyphens"
          className={inputClass}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category">
          <input
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
            list="category-options"
            placeholder="Pick or type a new one"
            className={inputClass}
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field>
        <Field label="Year">
          <input
            type="number"
            min={1900}
            max={2100}
            value={values.year}
            onChange={(e) => set("year", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Description">
        <textarea
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          className={inputClass}
        />
      </Field>
      <Field label="Production">
        <input value={values.production} onChange={(e) => set("production", e.target.value)} className={inputClass} />
      </Field>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-300">Extra credits</span>
          <button
            type="button"
            onClick={() => set("fields", [...values.fields, { label: "", value: "" }])}
            className="text-sm text-neutral-400 hover:text-neutral-100"
          >
            + Add row
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {values.fields.map((field, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Label (e.g. Client)"
                value={field.label}
                onChange={(e) => updateField(i, { label: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Value"
                value={field.value}
                onChange={(e) => updateField(i, { value: e.target.value })}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => set("fields", values.fields.filter((_, index) => index !== i))}
                className="px-2 text-neutral-500 hover:text-red-500"
                aria-label="Remove row"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={saving} className={`w-fit ${primaryButtonClass}`}>
        {saving ? "Saving..." : projectId ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-neutral-300">{label}</span>
      {children}
    </label>
  );
}
