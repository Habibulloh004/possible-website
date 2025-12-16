const FALLBACK_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://possible.uz";

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function ensureLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function getPublicImageUrl(
  src?: string | null
): string | undefined {
  if (!src) return undefined;

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  if (src.startsWith("//")) {
    return `https:${src}`;
  }

  const base = normalizeBaseUrl(FALLBACK_SITE_URL);
  return `${base}${ensureLeadingSlash(src)}`;
}
