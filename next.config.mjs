/** @type {import('next').NextConfig} */
const nextConfig = {
  // НИКАКОГО i18n здесь не нужно,
  // локали мы уже обрабатываем через папку [locale]

  images: {
    // Используем обычные <img>, чтобы картинки из /public
    // не проходили через Next Image Optimizer. На продакшене
    // именно optimizer отдавал пустой ответ и логотипы пропадали.
    unoptimized: true,
  },
};

export default nextConfig;
