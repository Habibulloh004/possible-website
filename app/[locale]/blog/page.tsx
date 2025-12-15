import { prisma } from "@/lib/prisma";
import { isLocale, type Locale } from "@/lib/i18n";
import Image from "next/image";
import type { Metadata } from "next";

// SEO metadata
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";

  // Пытаемся взять настройки сайта (дефолтные мета)
  let settings: any = null;
  try {
    settings = await prisma.siteSettings.findFirst({
      where: { id: 1 },
    });
  } catch {
    // если Prisma упадёт — просто используем дефолты
  }

  const baseUrl = "https://possible.uz";
  const pageUrl = `${baseUrl}/${locale}/blog`;

  const title =
    (isRu
      ? settings?.default_meta_title_ru
      : settings?.default_meta_title_uz) ||
    (isRu
      ? "Блог Possible Group — автоматизация, CRM, ERP, интеграции и рост бизнеса"
      : "Possible Group blogi — avtomatlashtirish, CRM, ERP, integratsiyalar va biznes o‘sishi");

  const description =
    (isRu
      ? settings?.default_meta_desc_ru
      : settings?.default_meta_desc_uz) ||
    (isRu
      ? "Статьи Possible Group про автоматизацию бизнеса, CRM/ERP, интеграции (Poster, Billz, 1C и др.), реальные кейсы клиентов и управляемый рост компаний в Узбекистане."
      : "Possible Group blogi: biznesni avtomatlashtirish, CRM/ERP, Poster, Billz, 1C integratsiyalari, mijozlar keyslari va O‘zbekiston sharoitida boshqariladigan o‘sish haqida maqolalar.");

  const keywords = isRu
    ? [
        "Possible Group блог",
        "блог Possible Group",
        "автоматизация бизнеса Узбекистан",
        "CRM Узбекистан",
        "ERP Узбекистан",
        "POS система Узбекистан",
        "интеграция Poster",
        "интеграция Billz",
        "интеграция 1C",
        "кейсы автоматизации",
        "кейсы Possible Group",
        "рост выручки",
        "оптимизация процессов",
      ]
    : [
        "Possible Group blog",
        "Possible Group blogi",
        "biznesni avtomatlashtirish",
        "CRM O‘zbekiston",
        "ERP O‘zbekiston",
        "POS tizimlari",
        "Poster integratsiyasi",
        "Billz integratsiyasi",
        "1C integratsiyasi",
        "avtomatlashtirish keyslari",
        "Possible Group keyslari",
        "tushumni oshirish",
        "jarayonlarni optimallashtirish",
      ];

  const ogImage =
    settings?.default_og_image || "/og-default.png";

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: pageUrl,
      languages: {
        "ru-UZ": `${baseUrl}/ru/blog`,
        "uz-UZ": `${baseUrl}/uz/blog`,
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Possible Group",
      type: "website",
      locale: isRu ? "ru_UZ" : "uz_UZ",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: isRu
            ? "Блог Possible Group — автоматизация бизнеса и интеграции"
            : "Possible Group blogi — biznesni avtomatlashtirish va integratsiyalar",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";

  const posts = await prisma.post.findMany({
    where: { is_published: true },
    orderBy: { published_at: "desc" },
    take: 30,
  });

  const titleKey = isRu ? "title_ru" : "title_uz";
  const excerptKey = isRu ? "excerpt_ru" : "excerpt_uz";
  const slugKey = isRu ? "slug_ru" : "slug_uz";

  const baseUrl = "https://possible.uz";
  const blogUrl = `${baseUrl}/${locale}/blog`;

  // JSON-LD для блога и статей
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: isRu ? "Блог Possible Group" : "Possible Group blogi",
    url: blogUrl,
    description: isRu
      ? "Блог Possible Group про автоматизацию бизнеса, CRM/ERP, интеграции и реальные кейсы клиентов."
      : "Possible Group blogi: biznesni avtomatlashtirish, CRM/ERP, integratsiyalar va mijozlar keyslari.",
    inLanguage: isRu ? "ru-RU" : "uz-UZ",
    blogPost: posts.map((p) => {
      const title = (p as any)[titleKey] as string;
      const slug = (p as any)[slugKey] as string;
      const excerpt = (p as any)[excerptKey] as string;
      const url = `${baseUrl}/${locale}/blog/${slug}`;

      return {
        "@type": "BlogPosting",
        headline: title,
        name: title,
        description: excerpt,
        url,
        mainEntityOfPage: url,
        datePublished: p.published_at
          ? new Date(p.published_at).toISOString()
          : undefined,
        image: p.og_image || undefined,
      };
    }),
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-10 space-y-8">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-4 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute right-10 top-40 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-emerald-500/16 blur-3xl" />
      </div>

      {/* JSON-LD для поисковиков */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* Hero */}
      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold">
          {isRu ? "Блог Possible Group" : "Possible Group blogi"}
        </h1>
        <p className="max-w-3xl text-sm text-neutral-400">
          {isRu
            ? "Пишем про автоматизацию, CRM/ERP, интеграции, кейсы клиентов и управляемый рост бизнеса в реалиях Узбекистана."
            : "Avtomatlashtirish, CRM/ERP, integratsiyalar, mijozlar keyslari va O‘zbekiston sharoitida boshqariladigan o‘sish haqida yozamiz."}
        </p>
      </header>

      {/* Posts grid */}
      <div className="space-y-4">
        {posts.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((p) => {
              const title = (p as any)[titleKey] as string;
              const excerpt = (p as any)[excerptKey] as string;
              const slug = (p as any)[slugKey] as string;

              return (
                <a
                  key={p.id}
                  href={`/${locale}/blog/${slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 transition hover:border-sky-400/60 hover:shadow-[0_0_40px_rgba(56,189,248,0.35)]"
                >
                  {/* Image */}
                  {p.og_image && (
                    <div className="relative h-44 w-full overflow-hidden border-b border-white/10 bg-neutral-900">
                      <Image
                        src={p.og_image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span>
                        {p.published_at
                          ? new Date(p.published_at).toLocaleDateString("ru-RU")
                          : isRu
                          ? "Черновик без даты"
                          : "Sanasiz draft"}
                      </span>
                      {p.tags && (
                        <span className="ml-2 line-clamp-1">
                          {(p.tags as string)
                            .split(",")
                            .slice(0, 3)
                            .map((tag) => tag.trim())
                            .join(" · ")}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-2 text-lg font-semibold text-white line-clamp-2">
                      {title}
                    </h2>

                    <p className="mt-1 text-sm text-neutral-300 line-clamp-3">
                      {excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="text-sky-300 group-hover:text-sky-200">
                        {isRu ? "Читать статью" : "Maqolani o‘qish"} →
                      </span>
                      <span>
                        {isRu
                          ? "3–6 минут чтения"
                          : "3–6 daqiqa o‘qish"}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-neutral-950/60 p-6 text-sm text-neutral-400">
            {isRu
              ? "Статей пока нет. Добавь первую через админ-панель блога — и блог начнёт подтягивать SEO по нужным запросам."
              : "Hozircha maqolalar yo‘q. Avval birinchi maqolani admin orqali qo‘shing — blog kerakli so‘zlar bo‘yicha SEO ishlashni boshlaydi."}
          </div>
        )}
      </div>
    </div>
  );
}
