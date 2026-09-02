export type MediaType = "image" | "gif" | "youtube";

export type FitMode = "cover" | "contain";

export type GalleryImage = {
  src: string;
  width: number;
  height: number;
  type: MediaType;
  // "youtube" items store a ready-to-embed URL in `src`.
  fitMode: FitMode;
};

export type Credit = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  category: string | null;
  description: string;
  thumbnail: string | null;
  gallery: GalleryImage[];
  credits: Credit[];
};

export type AnswerSection = {
  title: string;
  items: { number: string; question: string; answer: string }[];
};
