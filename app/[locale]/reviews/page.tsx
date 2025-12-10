import { prisma } from "@/lib/prisma";
import { isLocale, type Locale } from "@/lib/i18n";

// Revalidate reviews page every 10 minutes
export const revalidate = 600;

// --- Dynamic SEO metadata with Prisma (aggregate rating, defaults, hreflang) ---
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale: "ru" | "uz" = params.locale === "uz" ? "uz" : "ru";

  // подтягиваем настройки сайта и агрегированный рейтинг
  const [settings, agg] = await Promise.all([
    prisma.siteSettings.findFirst({
      where: { id: 1 },
    }),
    prisma.review.aggregate({
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);

  const reviewCount = agg._count._all || 0;
  const avgRating = agg._avg.rating || 5;

  const baseTitleRu = "Отзывы клиентов — Possible Group";
  const baseTitleUz = "Mijozlar fikrlari — Possible Group";

  const baseDescRu =
    "Читайте реальные отзывы владельцев бизнеса, автоматизировавших свои процессы с Possible Group. Результаты, опыт и впечатления клиентов из Узбекистана.";
  const baseDescUz =
    "Possible Group bilan jarayonlarini avtomatlashtirgan biznes egalari bergan real sharhlar, natijalar va taassurotlar.";

  const title =
    locale === "ru"
      ? `${baseTitleRu} | Средняя оценка ${avgRating.toFixed(1)} из 5`
      : `${baseTitleUz} | O‘rtacha baho ${avgRating.toFixed(1)} / 5`;

  const description = locale === "ru" ? baseDescRu : baseDescUz;

  const keywords =
    locale === "ru"
      ? "отзывы, отзывы клиентов, отзывы о Possible Group, мнения клиентов, рекомендации клиентов, рейтинг компании, рейтинг Possible Group, автоматизация бизнеса, автоматизация процессов, внедрение CRM, внедрение ERP, CRM Узбекистан, ERP Узбекистан, цифровизация бизнеса, оптимизация бизнеса, кейсы автоматизации, результаты автоматизации, реальный опыт клиентов, автоматизация ресторанов, автоматизация ритейла, автоматизация доставки, интеграции Poster POS, интеграции с 1С, интеграции со складами, бизнес-процессы, автоматизация учета, рост продаж, управление бизнесом, digital трансформация, автоматизация Uzbekistan, бизнес решения Possible Group, эффективные решения для бизнеса, CRM система Узбекистан, ERP система Узбекистан, отзывы автоматизация, внедрение IT решений, IT компания Узбекистан, лучшая автоматизация бизнеса, автоматизация под ключ, автоматизация малого бизнеса, автоматизация среднего бизнеса, кейсы Possible Group, успешные проекты, клиентские истории, цифровые решения для бизнеса, отзывы по автоматизации, профессиональная автоматизация, разработка IT решений, B2B автоматизация, технологические решения для бизнеса"
      : "sharhlar, mijozlar sharhlari, Possible Group sharhlari, mijozlarning fikri, tavsiyalar, reyting, kompaniya reytingi, biznes avtomatlashtirish, jarayonlarni avtomatlashtirish, CRM integratsiya, ERP integratsiya, CRM O‘zbekiston, ERP O‘zbekiston, biznesni raqamlashtirish, biznes optimizatsiyasi, avtomatlashtirish misollari, keyslar, mijozlar tajribasi, restoran avtomatlashtirish, retail avtomatlashtirish, dostavka tizimi avtomatlashtirish, Poster POS integratsiyasi, 1C integratsiya, ombor nazorati, biznes-jarayonlar boshqaruvi, sotuvlarni oshirish, biznes boshqaruvi, raqamli transformatsiya, avtomatlashtirish Uzbekistan, Possible Group biznes yechimlari, CRM tizimi Uzbekistan, ERP tizimi Uzbekistan, avtomatlashtirish sharhlari, IT yechimlar joriy etish, IT kompaniya Uzbekistan, eng yaxshi avtomatlashtirish, kichik biznes avtomatlashtirish, o‘rta biznes avtomatlashtirish, Possible Group keyslar, muvaffaqiyatli loyihalar, mijoz hikoyalari, biznes uchun raqamli yechimlar, avtomatlashtirish bo‘yicha sharhlar, professional avtomatlashtirish, IT yechimlar yaratish, B2B avtomatlashtirish, biznes uchun texnologik yechimlar";

  const baseUrl = `https://possible.uz/${locale}/reviews`;
  const ogImage =
    settings?.default_og_image || "https://possible.uz/og-default.png";
  const siteName = settings?.company_name || "Possible Group";

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: baseUrl,
      languages: {
        ru: "https://possible.uz/ru/reviews",
        uz: "https://possible.uz/uz/reviews",
      },
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      type: "website",
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Отзывы клиентов Possible Group",
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

export default async function ReviewsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";

  const [settings, reviews] = await Promise.all([
    prisma.siteSettings.findFirst({ where: { id: 1 } }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const textKey = isRu ? "text_ru" : "text_uz";

  const totalRating = reviews.reduce(
    (sum, r) => sum + (r.rating ?? 0),
    0,
  );
  const avgRating = reviews.length ? totalRating / reviews.length : 0;
  const baseUrl = `https://possible.uz/${locale}/reviews`;

  // --- JSON-LD: Organization + AggregateRating + Reviews + Breadcrumbs ---
  const organizationSchema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.company_name || "Possible Group",
    url: "https://possible.uz",
    logo: settings?.logo
      ? `https://possible.uz${settings.logo}`
      : "https://possible.uz/logo.png",
    sameAs: [
      settings?.instagram_url,
      settings?.telegram_url,
      settings?.facebook_url,
      settings?.linkedin_url,
      settings?.whatsapp_url,
    ].filter(Boolean),
  };

  if (reviews.length) {
    organizationSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };

    organizationSchema.review = reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.client_name,
      },
      reviewBody: (r as any)[textKey] as string,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating ?? 5,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isRu ? "Главная" : "Bosh sahifa",
        item: `https://possible.uz/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isRu ? "Отзывы" : "Sharhlar",
        item: baseUrl,
      },
    ],
  };

  const ldJson = JSON.stringify([organizationSchema, breadcrumbSchema]);

  return (
    <>
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: ldJson }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 space-y-10">
        {/* фоновые свечения */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-amber-500/18 blur-3xl" />
          <div className="absolute right-0 top-64 h-72 w-72 rounded-full bg-rose-500/18 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        {/* хедер */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-semibold">
                {isRu ? "Отзывы клиентов" : "Mijozlar fikrlari"}
              </h1>
              <p className="max-w-3xl text-sm md:text-[15px] leading-relaxed text-neutral-400">
                {isRu
                  ? "Реальные слова владельцев бизнеса, которые автоматизировали свои процессы вместе с Possible Group."
                  : "Possible Group bilan jarayonlarini avtomatlashtirgan biznes egalari bergan real fikrlar."}
              </p>
            </div>

            {/* агрегированный рейтинг справа */}
            {reviews.length > 0 && (
              <div className="rounded-2xl border border-amber-500/30 bg-neutral-950/80 px-4 py-3 text-xs text-neutral-200 shadow-[0_0_40px_rgba(251,191,36,0.26)]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">★</span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">
                      {avgRating.toFixed(1)} / 5
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {isRu
                        ? `На основе ${reviews.length} отзывов`
                        : `${reviews.length} ta sharh asosida`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* если отзывов нет */}
        {reviews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-neutral-950/60 p-6 text-sm text-neutral-500">
            {isRu
              ? "Отзывов пока нет. Добавь первые кейсы и отзывы через админ-панель — они сильно повышают доверие и конверсию."
              : "Hozircha sharhlar yo‘q. Admin panel orqali birinchi sharh va keyslarni qo‘shing — ular ishonch va konversiyani oshiradi."}
          </div>
        )}

        {/* сетка отзывов */}
        {reviews.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((r) => (
              <article
                key={r.id}
                className="group flex h-full flex-col rounded-2xl border border-white/8 bg-gradient-to-b from-neutral-950/95 via-neutral-950/90 to-black/90 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.65)] transition hover:-translate-y-1.5 hover:border-emerald-400/50 hover:shadow-[0_28px_70px_rgba(16,185,129,0.40)]"
                itemScope
                itemType="https://schema.org/Review"
              >
                {/* верхний блок: аватар + ФИО + компания */}
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {r.avatar ? (
                      <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-neutral-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={r.avatar}
                          alt={r.client_name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-neutral-900 text-xs font-semibold text-neutral-100">
                        <span>
                          {r.client_name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="leading-tight">
                      <div
                        className="text-sm font-medium text-neutral-50"
                        itemProp="author"
                      >
                        {r.client_name}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {[r.position, r.company].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-300"
                    itemProp="reviewRating"
                    itemScope
                    itemType="https://schema.org/Rating"
                  >
                    <span itemProp="ratingValue">
                      {"★".repeat(r.rating || 5)}
                    </span>
                    <span className="ml-1 text-[10px] text-neutral-400">
                      / 5
                    </span>
                    <meta itemProp="bestRating" content="5" />
                    <meta itemProp="worstRating" content="1" />
                  </div>
                </div>

                {/* текст отзыва */}
                <div className="relative flex-1 text-sm leading-relaxed text-neutral-100">
                  <span className="pointer-events-none absolute -left-1 -top-2 text-xl text-emerald-400/60">
                    “
                  </span>
                  <p className="pl-3" itemProp="reviewBody">
                    {(r as any)[textKey] as string}
                  </p>
                </div>

                {/* нижняя подпись */}
                <div className="mt-4 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>
                    {isRu
                      ? "Клиент Possible Group"
                      : "Possible Group mijozi"}
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                    {isRu ? "Автоматизация" : "Avtomatlashtirish"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
