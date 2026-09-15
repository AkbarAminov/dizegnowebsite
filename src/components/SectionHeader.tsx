// Title on the left, short intro on the right — the header every home-page
// section shares, so they read as one system.
export function SectionHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:items-end">
      <h2 className="text-2xl font-medium uppercase tracking-tight md:text-4xl">{title}</h2>
      {intro && <p className="max-w-md text-base opacity-70 md:justify-self-end">{intro}</p>}
    </div>
  );
}
