"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { ProjectInput } from "@/lib/validation";
import { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS, mapLocales, type Locale } from "@/lib/i18n";
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

type LocaleTranslation = { title: string; category: string; description: string; production: string };
type FieldTranslation = { label: string; value: string };
type FieldRow = { translations: Record<Locale, FieldTranslation> };

export type ProjectFormValues = {
  slug: string;
  year: string;
  translations: Record<Locale, LocaleTranslation>;
  fields: FieldRow[];
};

type Errors = {
  title?: string;
  slug?: string;
  year?: string;
  fields?: Record<number, Partial<Record<Locale, string>>>;
};

const EMPTY_TRANSLATION: LocaleTranslation = { title: "", category: "", description: "", production: "" };
const EMPTY_FIELD_TRANSLATION: FieldTranslation = { label: "", value: "" };

const EMPTY: ProjectFormValues = {
  slug: "",
  year: "",
  translations: { ru: { ...EMPTY_TRANSLATION }, en: { ...EMPTY_TRANSLATION }, uz: { ...EMPTY_TRANSLATION } },
  fields: [],
};

function emptyFieldRow(): FieldRow {
  return {
    translations: {
      ru: { ...EMPTY_FIELD_TRANSLATION },
      en: { ...EMPTY_FIELD_TRANSLATION },
      uz: { ...EMPTY_FIELD_TRANSLATION },
    },
  };
}

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
  if (!values.translations[DEFAULT_LOCALE].title.trim()) errors.title = "Give the project a title";
  if (!values.slug.trim()) errors.slug = "The URL cannot be empty";
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug.trim()))
    errors.slug = "Only lowercase letters, digits and hyphens";

  const year = values.year.trim();
  if (year && !(Number(year) >= 1900 && Number(year) <= 2100)) errors.year = "Enter a year between 1900 and 2100";

  // A row with only one half filled (in a given language) would be rejected
  // by the API; catch it here where the user can see which row is at fault.
  const rows: Record<number, Partial<Record<Locale, string>>> = {};
  values.fields.forEach((field, index) => {
    for (const locale of LOCALES) {
      const { label, value } = field.translations[locale];
      const hasLabel = Boolean(label.trim());
      const hasValue = Boolean(value.trim());
      if (hasLabel !== hasValue) {
        rows[index] = { ...rows[index], [locale]: hasLabel ? "Add a value" : "Add a label" };
      }
    }
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
  categories: Record<Locale, string[]>;
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
  const [activeLocale, setActiveLocale] = useState<Locale>(DEFAULT_LOCALE);
  // The slug follows the default-locale title until it is edited by hand,
  // so a new project never needs the URL typed out — and an existing URL is
  // never rewritten.
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

  function set<K extends "slug" | "year">(key: K, value: ProjectFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function setTranslation(locale: Locale, key: keyof LocaleTranslation, value: string) {
    setValues((current) => ({
      ...current,
      translations: { ...current.translations, [locale]: { ...current.translations[locale], [key]: value } },
      slug:
        key === "title" && locale === DEFAULT_LOCALE && !slugLocked ? slugify(value) : current.slug,
    }));
    if (key === "title") setErrors((current) => ({ ...current, title: undefined, slug: undefined }));
  }

  function updateFieldTranslation(index: number, locale: Locale, patch: Partial<FieldTranslation>) {
    setValues((current) => ({
      ...current,
      fields: current.fields.map((field, i) =>
        i === index
          ? { translations: { ...field.translations, [locale]: { ...field.translations[locale], ...patch } } }
          : field
      ),
    }));
    setErrors((current) => ({ ...current, fields: undefined }));
  }

  function addFieldRow() {
    setValues((current) => ({ ...current, fields: [...current.fields, emptyFieldRow()] }));
  }

  function removeFieldRow(index: number) {
    setValues((current) => ({ ...current, fields: current.fields.filter((_, i) => i !== index) }));
    setErrors((current) => ({ ...current, fields: undefined }));
  }

  // Which tabs currently have a validation error, so the tab strip itself
  // can flag them without the user needing to click through each one.
  const errorLocales = new Set<Locale>([
    ...(errors.title ? [DEFAULT_LOCALE] : []),
    ...(errors.fields ? (Object.values(errors.fields).flatMap((byLocale) => Object.keys(byLocale)) as Locale[]) : []),
  ]);

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
      if (found.title) setActiveLocale(DEFAULT_LOCALE);
      setToast({ text: "Check the highlighted fields", tone: "error" });
      return;
    }

    setSaving(true);
    const payload: ProjectInput = {
      slug: values.slug.trim(),
      year: values.year ? Number(values.year) : null,
      translations: mapLocales(values.translations, (t) => ({
        title: t.title.trim(),
        category: t.category.trim(),
        description: t.description.trim(),
        production: t.production.trim(),
      })),
      // Rows left completely blank (in every language) are dropped rather than rejected.
      fields: values.fields
        .filter((field) => LOCALES.some((l) => field.translations[l].label.trim() || field.translations[l].value.trim()))
        .map((field) => ({
          translations: mapLocales(field.translations, (t) => ({ label: t.label.trim(), value: t.value.trim() })),
        })),
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

  const t = values.translations[activeLocale];

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="flex flex-col gap-6">
        <LocaleTabs active={activeLocale} onChange={setActiveLocale} errorLocales={errorLocales} />

        <section className={cardClass}>
          <SectionHeader title="Basics" hint="Title and address of the project page." />
          <div className="flex flex-col gap-5 p-5 pt-0">
            <Field
              label={`Title (${LOCALE_LABELS[activeLocale]})`}
              error={activeLocale === DEFAULT_LOCALE ? errors.title : undefined}
              htmlFor="project-title"
              hint={activeLocale !== DEFAULT_LOCALE ? "Optional — falls back to the English copy until filled in." : undefined}
            >
              <input
                id="project-title"
                value={t.title}
                onChange={(event) => setTranslation(activeLocale, "title", event.target.value)}
                placeholder="North Star Identity"
                autoComplete="off"
                className={`${inputClass} ${activeLocale === DEFAULT_LOCALE && errors.title ? invalidInputClass : ""}`}
              />
            </Field>

            <Field
              label="URL"
              error={errors.slug}
              htmlFor="project-slug"
              hint={
                projectId
                  ? "Changing this breaks links that already point to the project. Shared across all languages."
                  : "Filled in from the default-language title — edit it if you want a different address."
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
              <Field
                label={`Category (${LOCALE_LABELS[activeLocale]})`}
                htmlFor="project-category"
                hint="Shown under the title. Reuse one or type a new one."
              >
                <input
                  id="project-category"
                  value={t.category}
                  onChange={(event) => setTranslation(activeLocale, "category", event.target.value)}
                  list="category-options"
                  placeholder="Branding"
                  className={inputClass}
                />
                <datalist id="category-options">
                  {categories[activeLocale].map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </Field>

              <Field label="Year" error={errors.year} htmlFor="project-year" hint="Optional. Shared across all languages.">
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
            <Field label={`Description (${LOCALE_LABELS[activeLocale]})`} htmlFor="project-description">
              <textarea
                id="project-description"
                value={t.description}
                onChange={(event) => setTranslation(activeLocale, "description", event.target.value)}
                rows={5}
                placeholder="What the project was and what you made."
                className={inputClass}
              />
            </Field>
            <Field
              label={`Production (${LOCALE_LABELS[activeLocale]})`}
              htmlFor="project-production"
              hint="Who produced it. Appears with the credits."
            >
              <input
                id="project-production"
                value={t.production}
                onChange={(event) => setTranslation(activeLocale, "production", event.target.value)}
                placeholder="Dizegno Studio"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className={cardClass}>
          <SectionHeader title="Credits" hint={`Extra rows such as Client, Photography or Award (${LOCALE_LABELS[activeLocale]}).`} />
          <div className="p-5 pt-0">
            {values.fields.length > 0 && (
              <ul className="flex flex-col gap-2">
                {values.fields.map((field, index) => {
                  const rowTranslation = field.translations[activeLocale];
                  const rowError = errors.fields?.[index]?.[activeLocale];
                  return (
                    <li key={index} className="flex items-start gap-2">
                      <div className="grid flex-1 gap-2 sm:grid-cols-[14rem_minmax(0,1fr)]">
                        <input
                          aria-label={`Credit ${index + 1} label`}
                          placeholder="Client"
                          value={rowTranslation.label}
                          onChange={(event) => updateFieldTranslation(index, activeLocale, { label: event.target.value })}
                          className={`${inputClass} ${rowError ? invalidInputClass : ""}`}
                        />
                        <input
                          aria-label={`Credit ${index + 1} value`}
                          placeholder="Acme Corp"
                          value={rowTranslation.value}
                          onChange={(event) => updateFieldTranslation(index, activeLocale, { value: event.target.value })}
                          className={`${inputClass} ${rowError ? invalidInputClass : ""}`}
                        />
                        {rowError && <p className="text-xs text-red-400 sm:col-span-2">{rowError}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFieldRow(index)}
                        className={`${iconButtonClass} mt-1 hover:bg-red-500/10 hover:text-red-400`}
                        title="Remove this credit"
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Remove credit {index + 1}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <button
              type="button"
              onClick={addFieldRow}
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
        title={`Delete "${saved.translations[DEFAULT_LOCALE].title}"?`}
        description="The project and all of its images will be removed from the site. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
      <Toast message={toast} onDismiss={dismissToast} />
    </form>
  );
}

function LocaleTabs({
  active,
  onChange,
  errorLocales,
}: {
  active: Locale;
  onChange: (locale: Locale) => void;
  errorLocales: Set<Locale>;
}) {
  return (
    <div className="flex w-fit gap-1 rounded-md border border-white/10 bg-panel p-1">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => onChange(locale)}
          className={`rounded px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors ${
            active === locale ? "bg-white text-black" : "text-neutral-400 hover:text-white"
          }`}
        >
          {LOCALE_LABELS[locale]}
          {errorLocales.has(locale) && <span className="ml-1 text-red-400">•</span>}
        </button>
      ))}
    </div>
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
