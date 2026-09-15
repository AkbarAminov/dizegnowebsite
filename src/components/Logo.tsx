import { LOCKUP_PATHS, LOGO_VIEWBOX, WORDMARK_PATHS } from "@/lib/logoPaths";

// Inline SVG so the wordmark and the "BRANDING AGENCY" lockup can be styled
// independently on hover (the parent link carries the `group` class).
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} role="img" aria-label="Dizegno — Branding Agency" className={className}>
      <g className="fill-white transition-opacity duration-200 group-hover:opacity-70">
        {WORDMARK_PATHS.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
      <g className="fill-white transition-colors duration-200 group-hover:fill-accent">
        {LOCKUP_PATHS.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
    </svg>
  );
}
