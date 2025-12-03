/** @type {import('next').NextConfig} */
const nextConfig = {
  // НИКАКОГО i18n здесь не нужно,
  // локали мы уже обрабатываем через папку [locale]
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
