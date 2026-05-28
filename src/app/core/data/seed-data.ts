export function getImageUrl(id: string, w = 1200, h = 500): string {
  return `https://picsum.photos/seed/${id}/${w}/${h}`;
}

export function getThumbnailUrl(id: string): string {
  return getImageUrl(id, 320, 180);
}

const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="%231e1e1e">
    <rect width="200" height="200"/>
    <text x="100" y="100" text-anchor="middle" dominant-baseline="central" fill="%23555" font-family="sans-serif" font-size="14">No Image</text>
  </svg>`
)}`;

export function handleImgError(event: Event): void {
  const img = event.target as HTMLImageElement;
  if (img && img.src !== FALLBACK_SVG) {
    img.src = FALLBACK_SVG;
  }
}
