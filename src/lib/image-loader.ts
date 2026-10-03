// Serves every article image through our own resizer (/api/img) instead of the original full-size file.
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // Feed data sometimes keeps HTML entities in URLs (e.g. "&#038;" for "&").
  const clean = src.replace(/&#0?38;|&amp;/g, '&');
  return `/api/img?u=${encodeURIComponent(clean)}&w=${width}&q=${quality || 70}`;
}
