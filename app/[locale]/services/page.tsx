import { prisma } from "@/lib/prisma";
import { isLocale, type Locale } from "@/lib/i18n";
import Image from "next/image";
import type { Metadata } from "next";

// Revalidate services listing every 10 minutes
export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";

  let settings: any | null = null;
  try {
    settings = await prisma.siteSettings.findFirst();
  } catch {
    // ignore, fallback to static meta
  }

  const baseUrl = "https://possible.uz";

  const title =
    (isRu
      ? settings?.default_meta_title_ru
      : settings?.default_meta_title_uz) ||
    (isRu
      ? "Услуги Possible Group — автоматизация бизнеса в Узбекистане"
      : "Possible Group xizmatlari — O‘zbekistonda biznes avtomatlashtirish");

  const description =
    (isRu
      ? settings?.default_meta_desc_ru
      : settings?.default_meta_desc_uz) ||
    (isRu
      ? "Услуги Possible Group по автоматизации бизнеса: разработка POS‑систем, CRM, ERP, интеграции с Poster, Billz, 1C, МойСклад, а также кастомные IT‑решения для ритейла и общепита в Узбекистане."
      : "Possible Group xizmatlari: POS tizimlar, CRM, ERP, Poster, Billz, 1C, MoyiSklad integratsiyasi va retail hamda umumiy ovqatlanish uchun maxsus IT yechimlar.");

  const keywordsRu = [
    "услуги Possible Group",
    "автоматизация бизнеса Узбекистан",
    "разработка POS системы",
    "CRM для ритейла Узбекистан",
    "ERP внедрение Ташкент",
    "интеграция Poster Billz 1C",
    "автоматизация ресторана",
    "автоматизация розничной сети",
  ];

  const keywordsUz = [
    "Possible Group xizmatlari",
    "biznes avtomatlashtirish O‘zbekiston",
    "POS tizim yaratish",
    "retail uchun CRM",
    "ERP joriy etish Toshkent",
    "Poster Billz 1C integratsiyasi",
    "restoran avtomatlashtirish",
    "do‘konlar tarmog‘ini avtomatlashtirish",
  ];

  const ogImage = settings?.default_og_image || `${baseUrl}/og-default.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/services`,
      languages: {
        "ru-UZ": `${baseUrl}/ru/services`,
        "uz-UZ": `${baseUrl}/uz/services`,
      },
    },
    openGraph: {
      type: "website",
      url: `${baseUrl}/${locale}/services`,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: isRu
            ? "Услуги Possible Group по автоматизации бизнеса"
            : "Possible Group biznes avtomatlashtirish xizmatlari",
        },
      ],
      siteName: "Possible Group",
      locale: isRu ? "ru_RU" : "uz_UZ",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    keywords: isRu ? keywordsRu : keywordsUz,
  };
}

export default async function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";

  const services = await prisma.service.findMany({
    orderBy: { id: "asc" },
  });

  const titleKey = isRu ? "title_ru" : "title_uz";
  const shortKey = isRu
    ? "short_description_ru"
    : "short_description_uz";
  const slugKey = isRu ? "slug_ru" : "slug_uz";

  const pageTitle = isRu ? "Услуги Possible Group" : "Possible Group xizmatlari";
  const pageSubtitle = isRu
    ? "Мы собираем CRM, ERP, POS, интеграции и кастомные решения в один управляемый контур. Ниже — основные направления, с которыми мы работаем."
    : "CRM, ERP, POS, integratsiyalar va maxsus yechimlarni bitta boshqariladigan ekotizimga birlashtiramiz. Quyida asosiy yo‘nalishlar.";

  const baseUrl = "https://possible.uz";

  const itemList = services.map((s, index) => {
    const title = (s as any)[titleKey] as string | undefined;
    const short = (s as any)[shortKey] as string | undefined;
    const slug = (s as any)[slugKey] as string | undefined;

    return {
      "@type": "ListItem",
      position: index + 1,
      url: slug ? `${baseUrl}/${locale}/services/${slug}` : baseUrl,
      name:
        title ||
        (isRu
          ? "Услуга по автоматизации бизнеса"
          : "Biznes avtomatlashtirish xizmati"),
      description:
        short ||
        (isRu
          ? "Услуга Possible Group по автоматизации процессов и интеграции систем."
          : "Possible Group’dan biznes jarayonlari va tizimlarni integratsiya qilish xizmati."),
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
    description: pageSubtitle,
    itemListElement: itemList,
  };

  return (
    <main className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      {/* фоновые "огни" */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Заголовок страницы */}
      <header className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mt-1 text-3xl font-semibold leading-tight md:text-4xl">
              {pageTitle}
            </h1>
          </div>
          <a
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white text-xs font-medium text-black shadow-lg shadow-white/20 px-5 py-2 hover:bg-neutral-100"
          >
            {isRu ? "Подобрать услугу" : "Xizmat tanlash"}
          </a>
        </div>
        <p className="max-w-3xl text-sm text-neutral-300">
          {pageSubtitle}
        </p>
      </header>

      {/* Список услуг */}
      {services.length === 0 ? (
        <p className="text-sm text-neutral-500">
          {isRu
            ? "Пока услуг нет. Добавь их в админке, чтобы они появились здесь."
            : "Hozircha xizmatlar yo‘q. Ularni admin panel orqali qo‘shing."}
        </p>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-neutral-200">
              {isRu
                ? "Основные направления"
                : "Asosiy yo‘nalishlar"}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {services.map((s, index) => {
              const title = (s as any)[titleKey] as string | undefined;
              const short = (s as any)[shortKey] as string | undefined;
              const slug = (s as any)[slugKey] as string | undefined;

              if (!slug) return null;

              return (
                <a
                  key={s.id}
                  href={`/${locale}/services/${slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-5 shadow-[0_0_40px_rgba(0,0,0,0.7)] transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-[0_0_60px_rgba(34,211,238,0.4)]"
                >
                  {/* Превью услуги */}
                  {(s as any).og_image && (
                    <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/60">
                      <div className="relative h-40 w-full">
                        <Image
                          src={(s as any).og_image as string}
                          alt={title || (isRu ? "Изображение услуги" : "Xizmat rasmi")}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                      </div>
                    </div>
                  )}
                  {/* Заголовок и описание */}
                  <h2 className="mb-2 text-lg font-semibold text-white md:text-xl">
                    {title || (isRu ? "Без названия" : "Sarlavhasiz")}
                  </h2>
                  <p className="mb-4 text-xs text-neutral-300 md:text-sm">
                    {short ||
                      (isRu
                        ? "Добавь краткое описание услуги в админке, чтобы клиент быстрее понимал пользу."
                        : "Xizmat haqida qisqacha tavsifni admin panel orqali qo‘shing.")}
                  </p>

                  {/* Нижняя зона — маркеры ценности */}
                  <div className="mt-auto flex items-end justify-between gap-3 text-[11px] text-neutral-400">
                    <div className="space-y-1">
                      <p className="font-medium text-neutral-200">
                        {isRu
                          ? "Что даёт услуга"
                          : "Xizmat natijasi"}
                      </p>
                      <ul className="space-y-0.5">
                        <li>
                          •{" "}
                          {isRu
                            ? "Прозрачные цифры по бизнесу"
                            : "Biznes bo‘yicha aniq raqamlar"}
                        </li>
                        <li>
                          •{" "}
                          {isRu
                            ? "Меньше ручных операций"
                            : "Kamroq qo‘l mehnati"}
                        </li>
                        <li>
                          •{" "}
                          {isRu
                            ? "Готовность к росту сети"
                            : "Tarmoqni kengaytirishga tayyorgarlik"}
                        </li>
                      </ul>
                    </div>
                    <div className="text-right">
                      <span className="block text-cyan-300 group-hover:text-cyan-200">
                        {isRu ? "Открыть услугу" : "Xizmatni ko‘rish"} →
                      </span>
                      <span className="mt-1 block text-[10px] text-neutral-500">
                        {isRu
                          ? "детали, этапы внедрения и кейсы"
                          : "bosqichlar va keyslar bilan batafsil"}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Подсказка по выбору услуги */}
      <section className="mt-6 rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/15 via-neutral-950 to-purple-500/15 p-[1px]">
        <div className="rounded-[22px] bg-black/85 px-5 py-5 md:px-7 md:py-6">
          <div className="grid gap-4 md:grid-cols-[1.6fr,1fr] md:items-center">
            <div>
              <h2 className="text-sm font-semibold text-white md:text-base">
                {isRu
                  ? "Не обязательно сразу разбираться во всех услугах"
                  : "Hamma xizmatlarni bir zumda tushunish shart emas"}
              </h2>
              <p className="mt-2 text-xs text-neutral-300 md:text-sm">
                {isRu
                  ? "Расскажи, что сейчас болит в бизнесе: учёт, склад, кассы, доставка или аналитика. Мы сами предложим комбинацию решений."
                  : "Biznesingizda ayni paytda qayerda og‘riq borligini ayting: hisob, ombor, kassalar, yetkazib berish yoki analitika. Biz kerakli yechim kombinatsiyasini taklif qilamiz."}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <a
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-medium text-black shadow-lg shadow-white/25 hover:bg-neutral-100"
              >
                {isRu
                  ? "Описать задачу и получить предложение"
                  : "Konsultatsiya olish"}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
