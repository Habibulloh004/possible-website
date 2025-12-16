function parseHost(value, fallbackProtocol = "https") {
  if (!value) return null;
  try {
    const withProtocol = value.includes("://")
      ? value
      : `${fallbackProtocol}://${value}`;
    const url = new URL(withProtocol);
    return {
      hostname: url.hostname,
      protocol: url.protocol.replace(":", "") || "https",
    };
  } catch {
    return null;
  }
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const remoteHosts = new Map();

function addHost(value, fallbackProtocol = "https") {
  const parsed = parseHost(value, fallbackProtocol);
  if (!parsed) return;
  const existing = remoteHosts.get(parsed.hostname) ?? new Set();
  existing.add(parsed.protocol);
  remoteHosts.set(parsed.hostname, existing);
}

const defaultHosts = [
  { value: "localhost", protocol: "http" },
  { value: "127.0.0.1", protocol: "http" },
  { value: "possible.uz", protocol: "https" },
  { value: "www.possible.uz", protocol: "https" },
];

defaultHosts.forEach(({ value, protocol }) => addHost(value, protocol));
addHost(siteUrl);

const extraHosts = process.env.NEXT_IMAGE_REMOTE_HOSTS || "";
extraHosts
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean)
  .forEach((value) => addHost(value));

const remotePatterns = Array.from(remoteHosts.entries()).flatMap(
  ([hostname, protocols]) =>
    Array.from(protocols).map((protocol) => ({
      protocol,
      hostname,
    }))
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
