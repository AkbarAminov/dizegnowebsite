# Design style

Rules for building/changing UI. Tailwind CSS 4 only (no CSS files except `src/app/globals.css`, no inline `style` except computed values like dnd transforms or the pointer-following label). Two surfaces with **different** design languages: the **public site** (editorial, dark, motion-rich) and the **admin** (functional dark dashboard). Don't mix their vocabularies.

## Color tokens
Defined in `src/app/globals.css` `@theme`; use as Tailwind utilities (`bg-canvas`, `text-accent`, …).

| Token | Value | Meaning | Use |
|-------|-------|---------|-----|
| `accent` | `#f0e10c` yellow | the one brand color | sparingly — hover arrows, active pin, contact `+` button, CTA borders. Never a large fill. |
| `canvas` | `#141414` | public-site ground (soft charcoal) | `bg-canvas`; body default |
| `surface` | `#1a1a1a` | admin chrome (one step lighter) | admin shell / bars |
| `panel` | `#232323` | admin cards | `bg-panel` |

- **Never pure black (`#000`) on purpose** — canvas is charcoal so dark areas read as a surface, not a void.
- **Public site** = white text on `canvas`; hierarchy comes from **opacity** (`opacity-70`, `opacity-60`), not gray tokens. Overlays invert: contact modal is `bg-white text-black`.
- **Admin** = `text-neutral-{100,200,300,400,500}` on `surface`/`panel`. Semantics: green = on/published (`bg-green-500`), red = danger/error, white button = primary action.
- Borders are hairlines over the dark ground: `border-white/10` (card), `border-white/15` (input), `border-white/5` (row divider).

## Typography
- Font: system Helvetica Neue stack (`--font-sans`), no web font loaded.
- **Public headings / nav / labels / buttons: `uppercase tracking-tight`.** This is the site's signature — keep it.
- Weights: body normal, emphasis `font-medium`, admin section headers `font-semibold`.
- Fluid project title: class `.project-title` (`clamp(1.75rem, 2.2vw, 3.5rem)`), not a text utility.
- Content strings are widow-protected by `preventOrphans` in the data layer — don't re-implement in components.

## Spacing & layout
- **Horizontal gutter rhythm: `px-5 md:px-8`** on full-width sections. Reuse it; don't pick arbitrary paddings.
- Fixed header `h-16 md:h-20`; pages offset the top: standard `pt-16 md:pt-20`, home hero `pt-24 md:pt-28`.
- Project grid: `WorkGrid` with `columns={2}` (default) or `3`; cards are `aspect-[4/3]`, image `object-cover`. Reuse `WorkGrid` for any card grid (home, work, related).
- Widths: forms `max-w-xl`, modal `max-w-md`, intro copy `max-w-sm`.
- Mobile-first; add `sm:`/`md:`/`lg:` up. Check the 3 breakpoints used in `COLUMN_CLASSES` before adding new ones.

## Motion (Framer Motion + CSS)
Use CSS transitions for hover/simple state; Framer Motion for reveal, route, and modal.

- **Signature easing: `[0.16, 1, 0.3, 1]`** (ease-out-expo). Use it for meaningful entrances/transitions.
- Scroll reveal: wrap in `<RevealOnScroll>` — `opacity 0→1`, `y 24→0`, `0.6s`, `viewport once amount 0.2`. Stagger lists with `delay={Math.min(index * 0.06, 0.3)}`.
- Route change: `PageTransition` (keyed by pathname, fade + rise, `0.45s`) — already in the site layout.
- Modal: overlay `opacity` `0.25s`; panel `scale 0.94→1` `0.3s` (`ContactPopup.tsx`).
- Hover: `transition-* duration-200` for color/opacity; image zoom `duration-700 ease-out group-hover:scale-[1.03]`.
- Marquee (`PartnersMarquee`): CSS `@keyframes marquee` translates `0 → -50%` over a track duplicated twice; loop is seamless because of the doubling.
- Perf: don't re-render per mouse-move — follow the pointer with direct DOM writes (`WorkGrid.tsx` label).

## Interaction & accessibility (required)
- Focus: append the shared `focusRing` (admin, `ui.ts`) or `focus-visible:outline` on public controls. Never remove focus styling.
- State that changes the site uses a labelled **`Switch`** (`role="switch"`, `aria-checked`, words next to it) — never a badge that happens to be clickable.
- Icon-only buttons need both `title` and an `sr-only` label (`ProjectsTable` action column).
- Optimistic actions must confirm through **`Toast`** (`role="status" aria-live="polite"`; success auto-dismisses 2.5s, error is sticky with Dismiss).
- Destructive actions go through **`ConfirmDialog`**, never a raw `confirm()`.
- Overlays: lock scroll with `useLockBodyScroll(open)`, close on Escape + backdrop click, set `role="dialog" aria-modal="true"` + `aria-labelledby`.

## Images
- `next/image` with `fill` + explicit `sizes`; `priority` only for above-the-fold (first 2 grid cards). Card wrappers are `relative overflow-hidden`.
- GIFs render `unoptimized`; YouTube items store the embed URL and use an `img.youtube.com` thumbnail (never a card thumbnail — `toProject` prefers a real image). Remote hosts must be allow-listed in `next.config.ts`.

## Admin component kit — reuse, don't re-style
Shared classes + the `api()` wrapper live in `src/app/admin/(dashboard)/ui.ts`. Compose these; don't hand-roll equivalents:
`inputClass`, `invalidInputClass`, `primaryButtonClass`, `secondaryButtonClass`, `dangerButtonClass`, `iconButtonClass`, `cardClass`, `labelClass`, `hintClass`, `focusRing`.
Admin cards: `<section className={cardClass}>` + a `SectionHeader`; forms use the local `Field` wrapper (label + error/hint) — see `ProjectForm.tsx`.
