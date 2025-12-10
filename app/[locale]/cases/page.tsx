import { prisma } from "@/lib/prisma";
import { isLocale, type Locale } from "@/lib/i18n";
import Image from "next/image";
import type { Metadata } from "next";

const BASE_URL = "https://possible.uz";

// SEO metadata for /[locale]/cases
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";

  // Берём общие настройки сайта (если есть)
  let settings: any = null;
  try {
    settings = await prisma.siteSettings.findFirst();
  } catch {
    // если таблицы ещё нет — просто игнорируем
  }

  const defaultTitleRu =
    settings?.default_meta_title_ru ??
    "Кейсы по автоматизации бизнеса | Possible Group";
  const defaultTitleUz =
    settings?.default_meta_title_uz ??
    "Biznesni avtomatlashtirish keyslari | Possible Group";

  const defaultDescRu =
    settings?.default_meta_desc_ru ??
    "Реальные кейсы Possible Group по автоматизации ритейла, общепита и сервисов: POS, CRM, ERP, интеграции и кастомные IT-системы.";
  const defaultDescUz =
    settings?.default_meta_desc_uz ??
    "Possible Group tomonidan retail, umumiy ovqatlanish va xizmatlar uchun avtomatlashtirish bo‘yicha real keyslari: POS, CRM, ERP, integratsiyalar va maxsus IT tizimlar.";

  const title = isRu
    ? "Кейсы Possible Group — автоматизация реального бизнеса"
    : "Possible Group keyslari — real biznes avtomatlashtirish";

  const description = isRu ? defaultDescRu : defaultDescUz;

  const keywordsRu = [
    "кейсы автоматизации",
    "кейсы Possible Group",
    "автоматизация бизнеса Узбекистан",
    "автоматизация ритейла",
    "автоматизация общепита",
    "POS система кейс",
    "CRM внедрение кейс",
    "ERP кейс Узбекистан",
    "интеграция Poster",
    "интеграция Billz",
    "интеграция 1C",
    "кейсы цифровизации",
    "IT-решения для бизнеса",
  ];

  const keywordsUz = [
    "biznes avtomatlashtirish keyslari",
    "Possible Group case",
    "O‘zbekiston biznes avtomatlashtirish",
    "retail avtomatlashtirish",
    "umumiy ovqatlanish avtomatlashtirish",
    "POS tizim keys",
    "CRM joriy etish keys",
    "ERP keys O‘zbekiston",
    "Poster integratsiya keys",
    "Billz integratsiya",
    "1C integratsiya",
    "raqamlashtirish keyslari",
    "biznes uchun IT yechimlar",
  ];

  const path = `/${locale}/cases`;
  const canonical = `${BASE_URL}${path}`;

  return {
    title: isRu ? `${title} | Possible Group` : `${title} | Possible Group`,
    description,
    keywords: isRu ? keywordsRu : keywordsUz,
    alternates: {
      canonical,
      languages: {
        "ru-UZ": `${BASE_URL}/ru/cases`,
        "uz-UZ": `${BASE_URL}/uz/cases`,
      },
    },
    openGraph: {
      title: isRu ? title : title,
      description,
      url: canonical,
      siteName: "Possible Group",
      type: "website",
      locale: isRu ? "ru_UZ" : "uz_UZ",
      images: [
        {
          url: settings?.default_og_image ?? `${BASE_URL}/og-default.png`,
          width: 1200,
          height: 630,
          alt: isRu
            ? "Кейсы Possible Group по автоматизации бизнеса"
            : "Possible Group biznes avtomatlashtirish keyslari",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isRu ? title : title,
      description,
      images: [
        settings?.default_og_image ?? `${BASE_URL}/og-default.png`,
      ],
    },
  };
}

export default async function CasesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";

  const cases = await prisma.case.findMany({
    orderBy: { createdAt: "desc" },
  });

  const titleKey = isRu ? "title_ru" : "title_uz";
  const slugKey = isRu ? "slug_ru" : "slug_uz";
  const descriptionKey = isRu ? "description_ru" : "description_uz";

  // JSON-LD для списка кейсов (ItemList)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isRu ? "Кейсы Possible Group" : "Possible Group keyslari",
    description: isRu
      ? "Реальные кейсы по автоматизации ритейла, общепита и сервисов в Узбекистане."
      : "O‘zbekistondagi retail, umumiy ovqatlanish va servislarni avtomatlashtirish bo‘yicha real keyslari.",
    itemListElement: cases.map((c, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/${locale}/cases/${(c as any)[slugKey]}`,
      name: (c as any)[titleKey],
      description:
        ((c as any)[descriptionKey] as string | null) || undefined,
      industry: c.industry,
      datePublished: c.launch_date
        ? new Date(c.launch_date).toISOString()
        : undefined,
    })),
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-10 space-y-10">
      {/* JSON-LD для SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />

      {/* фоновые акценты */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-0 top-72 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      </div>

      {/* header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold">
            {isRu ? "Кейсы Possible Group" : "Possible Group keyslari"}
          </h1>
          <p className="max-w-3xl text-sm md:text-[15px] text-neutral-400">
            {isRu
              ? "Реальные проекты для ритейла, общепита и сервисов, где автоматизация дала рост в выручке, управляемости и прозрачности цифр."
              : "Retail, umumiy ovqatlanish va servislar bo‘yicha loyihalar — avtomatlashtirish tushum, boshqaruv va shaffoflikni qanday oshirganini ko‘rishingiz mumkin."}
          </p>
        </div>

        {cases.length > 0 && (
          <div className="rounded-2xl border border-emerald-400/20 bg-neutral-950/70 px-4 py-3 text-xs text-neutral-300 shadow-[0_0_35px_rgba(16,185,129,0.25)]">
            <p className="font-medium">
              {isRu ? "Кейсов опубликовано:" : "Chiqarilgan keyslar:"}{" "}
              <span className="text-emerald-300">{cases.length}</span>
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              {isRu
                ? "Каждая история — это решённый хаос в учёте, автоматизация процессов и больше контроля для владельца."
                : "Har bir case — bu tartibga keltirilgan jarayonlar, raqamlar va biznes egasi uchun ko‘proq nazorat."}
            </p>
          </div>
        )}
      </header>

      {/* список кейсов */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => {
          const title = (c as any)[titleKey] as string;
          const slug = (c as any)[slugKey] as string;
          const description =
            ((c as any)[descriptionKey] as string | null) || "";

          return (
            <a
              key={c.id}
              href={`/${locale}/cases/${slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-950 via-neutral-900/90 to-black transition hover:border-emerald-400/60 hover:shadow-[0_0_45px_rgba(16,185,129,0.35)]"
            >
              {/* картинка */}
              <div className="relative h-40 w-full overflow-hidden border-b border-white/5 bg-gradient-to-tr from-emerald-500/20 via-neutral-900 to-indigo-500/20">
                {c.screenshots ? (
                  <Image
                    src={c.screenshots}
                    alt={title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                    {isRu
                      ? "Кейс по автоматизации"
                      : "Avtomatlashtirish case’i"}
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute left-3 top-3 inline-flex rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                  {c.industry}
                </div>
                {c.launch_date && (
                  <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] text-neutral-300">
                    {new Date(c.launch_date).toLocaleDateString("ru-RU")}
                  </div>
                )}
              </div>

              {/* контент */}
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-sm md:text-[15px] font-semibold text-white">
                  {title}
                </h2>
                <p className="mt-1 text-[11px] text-emerald-300">
                  {c.client_name}
                </p>

                {description && (
                  <p className="mt-2 line-clamp-3 text-xs text-neutral-400">
                    {description}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-300 group-hover:text-emerald-200">
                  <span>
                    {isRu ? "Смотреть результат" : "Natijani ko‘rish"}
                  </span>
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>
            </a>
          );
        })}

        {cases.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-neutral-700/60 bg-neutral-950/70 px-4 py-8 text-center text-sm text-neutral-500">
            {isRu
              ? "Кейсов пока нет. Добавь первый кейс в админке, и здесь появится галерея реализованных проектов."
              : "Hozircha keyslar yo‘q. Admin panel orqali birinchi keysni qo‘shing va bu yerda loyihalar galereyasi paydo bo‘ladi."}
          </div>
        )}
      </div>
    </div>
  );
}
