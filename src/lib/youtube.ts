const VIDEO_ID = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;

export function parseYoutubeId(url: string): string | null {
  return url.match(VIDEO_ID)?.[1] ?? null;
}

export function youtubeEmbedUrl(id: string) {
  return `https://www.youtube.com/embed/${id}`;
}

/** Static preview for grid tiles, derived from the stored embed URL. */
export function youtubeThumbnail(embedUrl: string) {
  return `https://img.youtube.com/vi/${embedUrl.split("/embed/")[1]}/hqdefault.jpg`;
}
