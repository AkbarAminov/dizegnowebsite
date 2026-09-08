"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { ProjectInput } from "@/lib/validation";
import { ConfirmDialog } from "./ConfirmDialog";
import { Switch } from "./Switch";
import { Toast, type ToastMessage } from "./Toast";
import {
  api,
  cardClass,
  dangerButtonClass,
  hintClass,
  iconButtonClass,
  inputClass,
  invalidInputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./ui";

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

type Errors = { title?: string; slug?: string; year?: string; fields?: Record<number, string> };

const EMPTY: ProjectFormValues = {
  title: "",
  slug: "",
  category: "",
  year: "",
  description: "",
  production: "",
  fields: [],
};

/** "Kinetic Motion Reel" → "kinetic-motion-reel"; non-latin titles yield "". */
function slugify(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validate(values: ProjectFormValues): Errors {
  const errors: Errors = {};
  if (!values.title.trim()) errors.title = "Give the project a title";
  if (!values.slug.trim()) errors.slug = "The URL cannot be empty";
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug.trim()))
    errors.slug = "Only lowercase letters, digits and hyphens";

  const year = values.year.trim();
  if (year && !(Number(year) >= 1900 && Number(year) <= 2100)) errors.year = "Enter a year between 1900 and 2100";

  // A row with only one half filled would be rejected by the API; catch it here
  // where the user can see which row is at fault.
  const rows: Record<number, string> = {};
  values.fields.forEach((field, index) => {
    const hasLabel = Boolean(field.label.trim());
    const hasValue = Boolean(field.value.trim());
    if (hasLabel !== hasValue) rows[index] = hasLabel ? "Add a value" : "Add a label";
  });
  if (Object.keys(rows).length) errors.fields = rows;

  return errors;
}

export function ProjectForm({
  projectId,
  initial = EMPTY,
  categories,
  published = false,
  pinned = false,
}: {
  // Absent when creating a new project.
  projectId?: string;
  initial?: ProjectFormValues;
  categories: string[];
  published?: boolean;
  pinned?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage>(null);
  const [visibility, setVisibility] = useState({ published, pinned });
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  // The slug follows the title until it is edited by hand, so a new project
  // never needs the URL typed out — and an existing URL is never rewritten.
  const [slugLocked, setSlugLocked] = useState(Boolean(projectId));

  const dismissToast = useCallback(() => setToast(null), []);
  const dirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(saved), [values, saved]);

  // Reloading or closing the tab with unsaved edits asks for confirmation.
  useEffect(() => {
    if (!dirty) return;
    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function set<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function setTitle(title: string) {
    setValues((current) => ({ ...current, title, slug: slugLocked ? current.slug : slugify(title) }));
    setErrors((current) => ({ ...current, title: undefined, slug: undefined }));
  }

  function updateField(index: number, patch: Partial<FieldRow>) {
    set(
      "fields",
      values.fields.map((field, i) => (i === index ? { ...field, ...patch } : field))
    );
    setErrors((current) => ({ ...current, fields: undefined }));
  }

  async function toggleVisibility(patch: Partial<typeof visibility>, done: string) {
    if (!projectId) return;
    const next = { ...visibility, ...patch };
    setVisibility(next);
    const result = await api(`/api/admin/projects/${projectId}`, "PATCH", patch);
    if (result.ok) {
      setToast({ text: done, tone: "success" });
      router.refresh();
    } else {
      setVisibility(visibility);
      setToast({ text: result.error, tone: "error" });
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const found = validate(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setToast({ text: "Check the highlighted fields", tone: "error" });
      return;
    }

    setSaving(true);
    const payload: ProjectInput = {
      ...values,
      title: values.title.trim(),
      slug: values.slug.trim(),
      year: values.year ? Number(values.year) : null,
      // Rows left completely blank are dropped rather than rejected.
      fields: values.fields.filter((field) => field.label.trim() || field.value.trim()),
    };

    const result = projectId
      ? await api(`/api/admin/projects/${projectId}`, "PATCH", payload)
      : await api<{ id: string }>("/api/admin/projects", "POST", payload);

    if (!result.ok) {
      setSaving(false);
      setToast({ text: result.error, tone: "error" });
      return;
    }

    if (projectId) {
      setSaved(values);
      setSaving(false);
      setToast({ text: "Changes saved", tone: "success" });
      router.refresh();
    } else {
      // Leave `saving` on: the page is about to be replaced by the editor.
      router.push(`/admin/projects/${(result.data as { id: string }).id}`);
    }
  }

  async function handleDelete() {
    setConfirmingDelete(false);
    const result = await api(`/api/admin/projects/${projectId}`, "DELETE");
    if (result.ok) router.push("/admin");
    else setToast({ text: result.error, tone: "error" });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="flex flex-col gap-6">
        <section className={cardClass}>
          <SectionHeader title="Basics" hint="Title and address of the project page." />
          <div className="flex flex-col gap-5 p-5 pt-0">
            <Field label="Title" error={errors.title} htmlFor="project-title">
              <input
                id="project-title"
                value={values.title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="North Star Identity"
                autoComplete="off"
                className={`${inputClass} ${errors.title ? invalidInputClass : ""}`}
              />
            </Field>

            <Field
              label="URL"
              error={errors.slug}
              htmlFor="project-slug"
              hint={
                projectId
                  ? "Changing this breaks links that already point to the project."
                  : "Filled in from the title — edit it if you want a different address."
              }
            >
              <div
                className={`flex items-center gap-0 overflow-hidden rounded-md border bg-white/5 transition-colors focus-within:border-white/50 ${
                  errors.slug ? "border-red-500/60" : "border-white/15"
                }`}
              >
                <span className="pl-3 text-sm text-neutral-500 select-none">/work/</span>
                <input
                  id="project-slug"
                  value={values.slug}
                  onChange={(event) => {
                    setSlugLocked(true);
                    set("slug", event.target.value);
                  }}
                  placeholder="north-star-identity"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-transparent px-1 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500"
                />
                <span className="pr-3 text-sm text-neutral-500 select-none">/</span>
              </div>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category" htmlFor="project-category" hint="Shown under the title. Reuse one or type a new one.">
                <input
                  id="project-category"
                  value={values.category}
                  onChange={(event) => set("category", event.target.value)}
                  list="category-options"
                  placeholder="Branding"
                  className={inputClass}
                />
                <datalist id="category-options">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </Field>

              <Field label="Year" error={errors.year} htmlFor="project-year" hint="Optional.">
                <input
                  id="project-year"
                  type="number"
                  inputMode="numeric"
                  min={1900}
                  max={2100}
                  value={values.year}
                  onChange={(event) => set("year", event.target.value)}
                  placeholder="2026"
                  className={`${inputClass} ${errors.year ? invalidInputClass : ""}`}
                />
              </Field>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <SectionHeader title="Story" hint="The text that runs beside the images on the project page." />
          <div className="flex flex-col gap-5 p-5 pt-0">
            <Field label="Description" htmlFor="project-description">
              <textarea
                id="project-description"
                value={values.description}
                onChange={(event) => set("description", event.target.value)}
                rows={5}
                placeholder="What the project was and what you made."
                className={inputClass}
              />
            </Field>
            <Field label="Production" htmlFor="project-production" hint="Who produced it. Appears with the credits.">
              <input
                id="project-production"
                value={values.production}
                onChange={(event) => set("production", event.target.value)}
                placeholder="Dizegno Studio"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className={cardClass}>
          <SectionHeader title="Credits" hint="Extra rows such as Client, Photography or Award." />
          <div className="p-5 pt-0">
            {values.fields.length > 0 && (
              <ul className="flex flex-col gap-2">
                {values.fields.map((field, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="grid flex-1 gap-2 sm:grid-cols-[14rem_minmax(0,1fr)]">
                      <input
                        aria-label={`Credit ${index + 1} label`}
                        placeholder="Client"
                        value={field.label}
                        onChange={(event) => updateField(index, { label: event.target.value })}
                        className={`${inputClass} ${errors.fields?.[index] ? invalidInputClass : ""}`}
                      />
                      <input
                        aria-label={`Credit ${index + 1} value`}
                        placeholder="Acme Corp"
                        value={field.value}
                        onChange={(event) => updateField(index, { value: event.target.value })}
                        className={`${inputClass} ${errors.fields?.[index] ? invalidInputClass : ""}`}
                      />
                      {errors.fields?.[index] && (
                        <p className="text-xs text-red-400 sm:col-span-2">{errors.fields[index]}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          "fields",
                          values.fields.filter((_, i) => i !== index)
                        )
                      }
                      className={`${iconButtonClass} mt-1 hover:bg-red-500/10 hover:text-red-400`}
                      title="Remove this credit"
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Remove credit {index + 1}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => set("fields", [...values.fields, { label: "", value: "" }])}
              className={`${secondaryButtonClass} ${values.fields.length ? "mt-3" : ""}`}
            >
              <Plus size={16} />
              Add credit
            </button>
          </div>
        </section>
      </div>

      <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
        <section className={cardClass}>
          <SectionHeader title="Visibility" />
          <div className="flex flex-col gap-4 p-5 pt-0">
            {projectId ? (
              <>
                <Switch
                  checked={visibility.published}
                  onChange={(next) =>
                    toggleVisibility({ published: next }, next ? "Published — the project is live" : "Moved to drafts")
                  }
                  label={visibility.published ? "Published" : "Draft"}
                  description={
                    visibility.published ? "Visible to everyone on the site." : "Only you can see it, in this admin."
                  }
                />
                <Switch
                  checked={visibility.pinned}
                  onChange={(next) => toggleVisibility({ pinned: next }, next ? "Featured" : "No longer featured")}
                  label="Featured"
                  description="Featured projects are shown before the others."
                />
                <p className={hintClass}>These two apply immediately — no need to save.</p>
              </>
            ) : (
              <p className="text-sm text-neutral-400">
                The project is created as a draft. You can add images and publish it on the next screen.
              </p>
            )}
          </div>
        </section>

        {projectId && (
          <section className={cardClass}>
            <SectionHeader title="Danger zone" />
            <div className="p-5 pt-0">
              <button type="button" onClick={() => setConfirmingDelete(true)} className={dangerButtonClass}>
                <Trash2 size={16} />
                Delete project
              </button>
            </div>
          </section>
        )}
      </aside>

      <div className="sticky bottom-0 z-30 -mx-4 mt-2 border-t border-white/10 bg-surface/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8 lg:col-span-2">
        <div className="flex items-center justify-end gap-4">
          <p aria-live="polite" className="mr-auto text-sm text-neutral-400">
            {dirty ? "Unsaved changes" : projectId ? "All changes saved" : "Fill in the title to get started"}
          </p>
          {projectId && dirty && (
            <button type="button" onClick={() => setValues(saved)} className={secondaryButtonClass} disabled={saving}>
              Discard
            </button>
          )}
          <button type="submit" disabled={saving || (Boolean(projectId) && !dirty)} className={primaryButtonClass}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {projectId ? "Save changes" : "Create project"}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title={`Delete "${saved.title}"?`}
        description="The project and all of its images will be removed from the site. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
      <Toast message={toast} onDismiss={dismissToast} />
    </form>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="p-5">
      <h2 className="text-sm font-semibold tracking-wide text-neutral-100 uppercase">{title}</h2>
      {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-red-400">{error}</p> : hint ? <p className={hintClass}>{hint}</p> : null}
    </div>
  );
}
