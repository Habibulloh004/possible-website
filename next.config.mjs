function parseHostname(value) {
  if (!value) return null;
  try {
    const maybeUrl = value.includes("://") ? value : `https://${value}`;
    return new URL(maybeUrl).hostname || null;
  } catch {
    return null;
  }
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const defaultDomains = [
  "localhost",
  "127.0.0.1",
  "possible.uz",
  "www.possible.uz",
];

const allowedDomains = new Set(defaultDomains);
const siteHostname = parseHostname(siteUrl);
if (siteHostname) {
  allowedDomains.add(siteHostname);
}

const extraHosts = process.env.NEXT_IMAGE_REMOTE_HOSTS || "";
extraHosts
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean)
  .forEach((value) => {
    const host = parseHostname(value) || value;
    if (host) allowedDomains.add(host);
  });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow project and CDN hosts for <Image /> optimization
    domains: Array.from(allowedDomains),
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
