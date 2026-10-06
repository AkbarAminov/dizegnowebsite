import sanitizeHtmlLib from "sanitize-html";

// Minimal formatting a project description needs: paragraphs, emphasis and
// lists. Anything else (links, headings, images, inline styles…) is
// stripped rather than rejected, so a paste from Word/Docs/the admin editor
// degrades gracefully instead of failing the save. Keep this in sync with
// the extensions enabled in RichTextEditor.tsx.
const ALLOWED_TAGS = ["p", "br", "strong", "em", "ul", "ol", "li"];

export function sanitizeRichText(html: string): string {
  return sanitizeHtmlLib(html, { allowedTags: ALLOWED_TAGS, allowedAttributes: {} }).trim();
}

// An editor that's been typed in and cleared out again leaves behind empty
// markup like "<p></p>" — still a non-empty string, so the plain `|| null`
// check the rest of the form uses for optional text doesn't catch it.
export function isRichTextEmpty(html: string): boolean {
  return richTextToPlainText(html).length === 0;
}

// For <meta> descriptions and JSON-LD, which want words, not markup.
export function richTextToPlainText(html: string): string {
  return sanitizeHtmlLib(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}
