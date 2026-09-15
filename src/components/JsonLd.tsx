// Structured data for search engines. A plain <script> is correct here —
// next/script is for executable code. "<" is escaped so content can never
// close the tag early.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
