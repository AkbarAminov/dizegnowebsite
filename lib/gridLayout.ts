export type CardSize = { tall: boolean; wide: boolean };

// Deterministic, position-based distribution instead of per-render
// randomness — keeps server/client markup identical (no hydration
// mismatch) and holds up for any list length. Only 4 shapes (1x1, 2x1,
// 1x2, 2x2) — kept deliberately restrained after an earlier 3-tier
// version with a taller "large" category and a bigger row-height unit
// turned out to add more complexity than it was worth.
const TALL_PATTERN = [false, true, false, false, true, false, true];
const WIDE_PATTERN = [false, true, false, false, true];

export function getCardSize(index: number): CardSize {
  return {
    tall: TALL_PATTERN[index % TALL_PATTERN.length],
    wide: WIDE_PATTERN[index % WIDE_PATTERN.length],
  };
}

export function getCardSpanClass(index: number): string {
  const { tall, wide } = getCardSize(index);
  // "wide" only applies from `sm` up — below that the grid is already a
  // single column, so col-span-2 would just force an overflow column
  // instead of doing anything useful. row-span is safe unconditionally,
  // it never causes horizontal overflow.
  return `${wide ? "sm:col-span-2" : "col-span-1"} ${tall ? "row-span-2" : "row-span-1"}`;
}
