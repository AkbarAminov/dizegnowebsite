// Stored ProjectImage.url for a "youtube" type is already a ready-to-embed
// URL (https://www.youtube.com/embed/<id>) — this derives a static preview
// thumbnail from it for grid tiles, using YouTube's public, no-API-key
// thumbnail endpoint.
export function getYoutubeThumbnail(embedUrl: string): string {
  const id = embedUrl.split("/embed/")[1];
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
