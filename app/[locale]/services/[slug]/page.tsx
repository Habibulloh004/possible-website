import { prisma } from "@/lib/prisma";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale: Locale = isLocale(params.locale) ? params.locale as Locale : "ru";
  const isRu = locale === "ru";

  const service = await prisma.service.findFirst({
    where: {
      OR: [{ slug_ru: params.slug }, { slug_uz: params.slug }],
    },
  });

  if (!service) {
    return {
      title: "Услуга | Possible Group",
    };
  }

  // Глобальные настройки сайта для дефолтных SEO-значений
  const settings = await prisma.siteSettings.findFirst({
    where: { id: 1 },
  });

  const metaTitle = isRu
    ? service.meta_title_ru ||
      service.title_ru ||
      settings?.default_meta_title_ru ||
      "Автоматизация бизнеса и IT-решения — Possible Group"
    : service.meta_title_uz ||
      service.title_uz ||
      settings?.default_meta_title_uz ||
      "Biznes avtomatlashtirish va IT yechimlari — Possible Group";

  const metaDescription = isRu
    ? service.meta_description_ru ||
      service.short_description_ru ||
      settings?.default_meta_desc_ru ||
      "Автоматизация ритейла, общепита и сервисных бизнесов в Узбекистане: CRM, ERP, POS, интеграции и кастомные IT-решения."
    : service.meta_description_uz ||
      service.short_description_uz ||
      settings?.default_meta_desc_uz ||
      "O‘zbekistonda retail, umumiy ovqatlanish va servis bizneslari uchun avtomatlashtirish: CRM, ERP, POS va maxsus IT yechimlar.";

  const metaKeywords = isRu
    ? service.meta_keywords_ru || ""
    : service.meta_keywords_uz || "";

  // Канонический URL: если задан в БД — берём его, иначе используем текущий URL
  const ruUrl = `/ru/services/${service.slug_ru}`;
  const uzUrl = `/uz/xizmatlar/${service.slug_uz}`;
  const canonical = service.canonical_url || (isRu ? ruUrl : uzUrl);

  const ogTitle = isRu
    ? service.og_title_ru || metaTitle
    : service.og_title_uz || metaTitle;

  const ogDescription = isRu
    ? service.og_description_ru || metaDescription
    : service.og_description_uz || metaDescription;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords || undefined,
    alternates: {
      canonical,
      languages: {
        ru: ruUrl,
        uz: uzUrl,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: isRu ? ruUrl : uzUrl,
      siteName: settings?.company_name || "Possible Group",
      images: service.og_image
        ? [{ url: service.og_image }]
        : settings?.default_og_image
        ? [{ url: settings.default_og_image }]
        : undefined,
      type: "website",
      locale: isRu ? "ru_RU" : "uz_UZ",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images:
        service.og_image ||
        settings?.default_og_image
          ? [service.og_image || (settings?.default_og_image as string)]
          : undefined,
    },
    robots: service.index
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
          nocache: true,
        },
  };
}

export default async function ServicePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";

  const service = await prisma.service.findFirst({
    where: {
      OR: [{ slug_ru: params.slug }, { slug_uz: params.slug }],
    },
  });

  if (!service) notFound();

  const title = isRu ? service.title_ru : service.title_uz;
  const rawContent = isRu ? service.content_ru : service.content_uz;
  const subtitle = isRu
    ? service.short_description_ru ||
      "Собираем CRM, ERP, POS, интеграции и аналитику в единую управляемую систему под задачи вашего бизнеса."
    : service.short_description_uz ||
      "CRM, ERP, POS, integratsiyalar va analitikani biznesingiz vazifalariga mos yagona boshqariladigan tizimga birlashtiramiz.";

  const problem = isRu ? service.problem_ru : service.problem_uz;
  const solution = isRu ? service.solution_ru : service.solution_uz;
  const result = isRu ? service.result_ru : service.result_uz;
  const fit = isRu ? service.fit_ru : service.fit_uz;

  const ruUrl = `/ru/services/${service.slug_ru}`;
  const uzUrl = `/uz/xizmatlar/${service.slug_uz}`;
  const pageUrl = isRu ? ruUrl : uzUrl;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: subtitle || undefined,
    url: pageUrl,
    areaServed: {
      "@type": "Country",
      name: "Uzbekistan",
    },
    provider: {
      "@type": "Organization",
      name: "Possible Group",
    },
    serviceType: isRu ? "Автоматизация бизнеса и IT-решения" : "Biznes avtomatlashtirish va IT yechimlari",
  };

  const paragraphs = rawContent
    ? rawContent
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 space-y-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* Фоновые градиенты */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-0 h-64 w-64 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Hero секция */}
      <section className="grid gap-8 md:grid-cols-[1.8fr,1fr] md:items-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm text-neutral-300">{subtitle}</p>

          <div className="flex flex-wrap gap-3 pt-2 text-xs">
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-medium text-black shadow-lg shadow-white/20 hover:bg-neutral-100"
            >
              {isRu ? "Получить консультацию" : "Konsultatsiya olish"}
            </a>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-medium text-neutral-100 hover:border-cyan-400 hover:text-cyan-300"
            >
              Telegram
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-medium text-neutral-100 hover:border-pink-400 hover:text-pink-300"
            >
              Instagram
            </a>
          </div>

        </div>

        {/* Картинка услуги, если есть */}
        <div className="relative">
          {service.og_image ? (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <div className="relative h-52 w-full md:h-64">
                <Image
                  src={service.og_image}
                  alt={title || "Service image"}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 420px, 100vw"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-52 w-full items-center justify-center rounded-3xl border border-dashed border-white/15 bg-neutral-950/70 text-center text-[11px] text-neutral-500 md:h-64">
              {isRu
                ? "Добавь для услуги OG-картинку через админку — она появится здесь и в превью соцсетей."
                : "Ushbu xizmat uchun OG rasmni admin panel orqali qo‘shing — u bu yerda va tarmoqlarda ko‘rinadi."}
            </div>
          )}
        </div>
      </section>

      {/* Основной контент + сайдбар */}
      <section className="grid gap-8 md:grid-cols-[2fr,1.05fr]">
        {/* Текст услуги */}
        <article className="space-y-4 text-sm leading-relaxed text-neutral-200">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p className="text-neutral-500">
              {isRu
                ? "Контент этой услуги пока пуст. Добавь подробное описание, этапы и примеры внедрения в админке."
                : "Bu xizmat uchun matn hali yo‘q. Admin panel orqali batafsil tavsif va bosqichlarni qo‘shing."}
            </p>
          )}

          {/* Блок с проблемой / решением / результатом (берём из БД, есть фолбэки) */}
          <div className="mt-4 grid gap-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-4 text-xs md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400">
                {isRu ? "Проблема" : "Muammo"}
              </p>
              <p className="text-neutral-300">
                {problem ||
                  (isRu
                    ? "Ручной учёт, разрозненные системы, владелец не видит картину по сети."
                    : "Qo‘l bilan yuritiladigan hisob, bo‘lingan tizimlar, egasi tarmoqqa umumiy qaray olmaydi.")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-400">
                {isRu ? "Решение" : "Yechim"}
              </p>
              <p className="text-neutral-300">
                {solution ||
                  (isRu
                    ? "Единый контур: кассы, склад, CRM, онлайн-оплаты, доставка и аналитика в одной системе."
                    : "Yagona kontur: kassa, ombor, CRM, online to‘lov, yetkazib berish va analitika bitta tizimda.")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                {isRu ? "Результат" : "Natija"}
              </p>
              <p className="text-neutral-300">
                {result ||
                  (isRu
                    ? "Прозрачные цифры, меньше ручных операций, готовность масштабировать сеть."
                    : "Aniq raqamlar, kamroq qo‘l mehnati, tarmoqni kengaytirishga tayyor tizim.")}
              </p>
            </div>
          </div>
        </article>

        {/* Сайдбар */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-4">
            <h3 className="mb-2 text-sm font-semibold">
              {isRu ? "Кому подойдёт эта услуга" : "Kimlar uchun qulay"}
            </h3>
            {fit ? (
              <p className="whitespace-pre-line text-xs text-neutral-300">
                {fit}
              </p>
            ) : (
              <ul className="space-y-1.5 text-xs text-neutral-300">
                <li>
                  •{" "}
                  {isRu
                    ? "Магазины и сети, которые устали от хаоса в учёте"
                    : "Hisobdagi tartibsizlikdan charchagan do‘kon va tarmoqlar"}
                </li>
                <li>
                  •{" "}
                  {isRu
                    ? "Кафе, рестораны, dark-kitchen с доставкой"
                    : "Yetkazib berish bilan ishlaydigan kafe, restoran va dark-kitchenlar"}
                </li>
                <li>
                  •{" "}
                  {isRu
                    ? "Владельцы, которые хотят видеть цифры в онлайне"
                    : "Onlayn raqamlarni ko‘rib borishni xohlaydigan egalari"}
                </li>
                <li>
                  •{" "}
                  {isRu
                    ? "Команды, готовые к системной автоматизации"
                    : "Tizimli avtomatlashtirishga tayyor jamoalar"}
                </li>
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-4">
            <h3 className="mb-2 text-sm font-semibold">
              {isRu
                ? "Обсудить внедрение услуги"
                : "Xizmatni joriy etishni muhokama qilish"}
            </h3>
            <p className="mb-3 text-xs text-neutral-100">
              {isRu
                ? "Опишите текущую ситуацию в бизнесе — мы предложим формат внедрения и примерный бюджет."
                : "Biznesdagi hozirgi vaziyatni yozing — joriy etish formati va taxminiy budjetni taklif qilamiz."}
            </p>
            <a
              href={`/${locale}/contact`}
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-medium text-black hover:bg-neutral-100"
            >
              {isRu ? "Оставить заявку" : "So‘rov qoldirish"}
            </a>
            <p className="mt-2 text-[11px] text-neutral-300">
              {isRu
                ? "Ответим в Telegram или WhatsApp, без навязчивых продаж."
                : "Javob Telegram yoki WhatsApp orqali, majburiy savdosiz."}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
