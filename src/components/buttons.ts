// Public-site call-to-action styles. The accent is a border, never a large
// fill (see docs/design-style.md); the fill only appears on hover.
const base =
  "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm uppercase tracking-tight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const primaryCtaClass = `${base} border border-accent text-accent hover:bg-accent hover:text-black`;

export const secondaryCtaClass = `${base} border border-white/30 text-white hover:border-white`;
