"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FieldRow = { label: string; value: string };

type ProjectData = {
  id: string;
  title: string;
  slug: string;
  category: string;
  year?: number;
  description: string;
  production: string;
  span: "normal" | "wide" | "tall";
  fields: FieldRow[];
};

const inputClass =
  "w-full rounded border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-white/40";

export function ProjectForm({
  mode,
  project,
  categories = [],
}: {
  mode: "create" | "edit";
  project?: ProjectData;
  categories?: string[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [category, setCategory] = useState(project?.category ?? "");
  const [year, setYear] = useState(project?.year ? String(project.year) : "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [production, setProduction] = useState(project?.production ?? "");
  const [span, setSpan] = useState<ProjectData["span"]>(project?.span ?? "normal");
  const [fields, setFields] = useState<FieldRow[]>(project?.fields ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(index: number, patch: Partial<FieldRow>) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug,
      category,
      year: year ? Number(year) : null,
      description,
      production,
      span,
      fields,
    };

    const url = mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${project!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong");
      setSaving(false);
      return;
    }

    if (mode === "create") {
      const created = await res.json();
      router.push(`/admin/projects/${created.id}`);
    } else {
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
      </Field>
      <Field label="Slug">
        <input value={slug} onChange={(e) => setSlug(e.target.value)} required className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-5">
        <Field label="Category">
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="category-options"
            placeholder="Pick or type a new one"
            className={inputClass}
          />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Year">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </Field>
      <Field label="Production">
        <input value={production} onChange={(e) => setProduction(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Grid span">
        <select
          value={span}
          onChange={(e) => setSpan(e.target.value as ProjectData["span"])}
          className={inputClass}
        >
          <option value="normal">Normal</option>
          <option value="wide">Wide</option>
          <option value="tall">Tall</option>
        </select>
      </Field>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-300">Extra fields</span>
          <button
            type="button"
            onClick={() => setFields((prev) => [...prev, { label: "", value: "" }])}
            className="text-sm text-neutral-400 hover:text-neutral-100"
          >
            + Add field
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {fields.map((field, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Label (e.g. CLIENT)"
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
                onClick={() => removeField(i)}
                className="px-2 text-neutral-500 hover:text-red-500"
                aria-label="Remove field"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50"
      >
        {saving ? "Saving..." : mode === "create" ? "Create project" : "Save changes"}
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
