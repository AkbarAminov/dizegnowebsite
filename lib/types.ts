// Legacy per-project grid size. WorkGrid/ProjectGallery now compute
// col-span/row-span from each card's position instead (see
// lib/gridLayout.ts), since that's the only way to guarantee "a big
// card every few items" — this stays only as WorkGridItem's fallback
// for callers that don't pass a position (none currently do).
export type ProjectSpan = "normal" | "wide" | "tall";

export type CreditRow = {
  label: string;
  value: string;
};

export type GalleryImageType = "image" | "gif" | "youtube";

export type ImageFitMode = "cover" | "contain";

// Real width/height (not just an orientation label) so the project
// gallery can size each grid cell from the image's actual aspect ratio
// instead of a hardcoded per-project value. `type` tells ProjectGallery/
// Lightbox how to render the item: next/image for "image", a plain <img>
// for "gif" (next/image would strip the animation), an embed iframe for
// "youtube" (src is already a ready-to-embed URL, not the watch URL).
export type GalleryImage = {
  src: string;
  width: number;
  height: number;
  type: GalleryImageType;
  fitMode: ImageFitMode;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: number;
  description: string;
  disciplines: string[];
  span: ProjectSpan;
  thumbnail: string;
  gallery: GalleryImage[];
  credits: CreditRow[];
};

export type AnswerItem = {
  number: string;
  question: string;
  answer: string;
};

// Answers page groups Q&A pairs under topic subheadings (branding basics,
// how projects run, advice before starting, pricing) instead of one flat
// list — see lib/data/answers.json.
export type AnswerSection = {
  title: string;
  items: AnswerItem[];
};
