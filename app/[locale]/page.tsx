import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Locale = "ru" | "uz";

// --- SEO: metadata for locale home page ---
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === "uz" ? "uz" : "ru";
  const isRu = locale === "ru";

  // Пытаемся взять настройки сайта, чтобы подставить дефолтные мета-данные
  let settings: any | null = null;
  try {
    settings = await prisma.siteSettings.findFirst();
  } catch {
    // если БД недоступна — просто используем жёстко заданные значения ниже
  }

  const baseUrl = "https://possible.uz";

  const title =
    (isRu
      ? settings?.default_meta_title_ru
      : settings?.default_meta_title_uz) ||
    (isRu
      ? "Автоматизация бизнеса в Узбекистане — Possible Group"
      : "O‘zbekistonda biznes avtomatlashtirish — Possible Group");

  const description =
    (isRu
      ? settings?.default_meta_desc_ru
      : settings?.default_meta_desc_uz) ||
    (isRu
      ? "Possible Group автоматизирует бизнес в Узбекистане: POS, CRM, ERP, склад, доставка, лояльность и интеграции — реальные IT-решения под ритейл и общепит."
      : "Possible Group O‘zbekistonda biznesni avtomatlashtiradi: POS, CRM, ERP, ombor, yetkazib berish, sodiqlik va integratsiyalar — retail va umumiy ovqatlanish uchun amaliy IT yechimlar.");

  const keywordsRu = [
    "автоматизация бизнеса",
    "POS система Узбекистан",
    "CRM для ритейла",
    "ERP решения Узбекистан",
    "интеграция Poster Billz 1C",
    "автоматизация розничной сети",
    "автоматизация ресторана",
    "Possible Group",
  ];

  const keywordsUz = [
    "biznes avtomatlashtirish",
    "POS tizim O‘zbekiston",
    "CRM retail uchun",
    "ERP yechimlar UZ",
    "Poster Billz 1C integratsiyasi",
    "do‘konlar tarmog‘i avtomatlashtirish",
    "restoran uchun POS",
    "Possible Group",
  ];

  const ogImage = settings?.default_og_image || `${baseUrl}/og-default.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "ru-UZ": `${baseUrl}/ru`,
        "uz-UZ": `${baseUrl}/uz`,
      },
    },
    openGraph: {
      type: "website",
      url: `${baseUrl}/${locale}`,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: isRu
            ? "Possible Group — автоматизация бизнеса в Узбекистане"
            : "Possible Group — O‘zbekistonda biznes avtomatlashtirish",
        },
      ],
      locale: isRu ? "ru_RU" : "uz_UZ",
      siteName: "Possible Group",
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

export default async function LocaleHomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === "uz" ? "uz" : "ru";
  const isRu = locale === "ru";

  // Пытаемся взять реальные данные из БД. Если что-то не так – просто используем демо.
  let servicesDb: any[] = [];
  let casesDb: any[] = [];
  let reviewsDb: any[] = [];
  let postsDb: any[] = [];

  try {
    [servicesDb, casesDb, reviewsDb, postsDb] = await Promise.all([
      prisma.service.findMany({ take: 6, orderBy: { id: "asc" } }),
      prisma.case.findMany({ take: 3, orderBy: { createdAt: "desc" } }),
      prisma.review.findMany({ where: { is_featured: true }, take: 4 }),
      prisma.post.findMany({
        where: { is_published: true },
        orderBy: { published_at: "desc" },
        take: 3,
      }),
    ]);
  } catch {
    // если Prisma упадёт — просто молча покажем демо
  }

  // --- DEMO-ДАННЫЕ, если БД пустая ---
  const demoServices = [
    {
      slug: "retail-automation",
      title_ru: "Автоматизация ритейла под ключ",
      title_uz: "Retail uchun to‘liq avtomatlashtirish",
      short_ru:
        "CRM, ERP, склад, кассы, лояльность и аналитика – в одной системе для сети магазинов.",
      short_uz:
        "CRM, ERP, ombor, kassalar, sodiqlik va analitika – bitta tizimda savdo tarmoqlari uchun.",
    },
    {
      slug: "restaurant-pos",
      title_ru: "POS + онлайн-доставка для общепита",
      title_uz: "POS va onlayn yetkazib berish",
      short_ru:
        "Единая система заказов: зал, доставка, агрегаторы, бонусы и отчётность для владельца.",
      short_uz:
        "Zal, yetkazib berish, agregatorlar, bonuslar va hisobotlar bitta tizimda.",
    },
    {
      slug: "integration-poster-1c",
      title_ru: "Интеграция Poster / Billz / 1C",
      title_uz: "Poster / Billz / 1C integratsiyasi",
      short_ru:
        "Связываем учёт, склад и финансы так, чтобы цифры всегда сходились без ручного Excel.",
      short_uz:
        "Ombor va moliyani shunday bog‘laymizki, raqamlar qo‘l, Excel’siz ham mos bo‘ladi.",
    },
  ];

  const demoCases = [
    {
      slug_ru: "retail-network",
      slug_uz: "retail-network",
      title_ru: "Сеть магазинов — +18% к выручке за 4 месяца",
      title_uz: "Do‘konlar tarmog‘i — 4 oyda +18% tushum",
      industry: "Retail",
      client_name: "Сеть магазинов формата convenience",
    },
    {
      slug_ru: "coffee-chain",
      slug_uz: "coffee-chain",
      title_ru: "Кофейни — единая система лояльности",
      title_uz: "Kofeynyalar — yagona sodiqlik tizimi",
      industry: "HoReCa",
      client_name: "Сеть городских кофе-поинтов",
    },
    {
      slug_ru: "sushi-delivery",
      slug_uz: "sushi-delivery",
      title_ru:
        "Доставка суши — прозрачная аналитика по рекламным каналам",
      title_uz:
        "Sushi yetkazib berish — reklama kanallari bo‘yicha analitika",
      industry: "Delivery",
      client_name: "Служба доставки японской кухни",
    },
  ];

  const demoReviews = [
    {
      id: 1,
      client_name: "Ритейл-сеть в Ташкенте",
      company: "10+ магазинов",
      rating: 5,
      text_ru:
        "После внедрения системы от Possible Group я впервые начал видеть реальные цифры по каждому магазину в одном дашборде.",
      text_uz:
        "Possible Group tizimi joriy qilingandan keyin nihoyat har bir do‘kon bo‘yicha raqamlarni bitta dashboard’da ko‘ra boshladik.",
    },
    {
      id: 2,
      client_name: "Сеть кофеен",
      company: "HoReCa",
      rating: 5,
      text_ru:
        "Онлайн-заказы, курьеры и бонусы наконец-то живут в одной системе. Команда быстро реагирует на доработки.",
      text_uz:
        "Onlayn buyurtmalar, kuryerlar va bonuslar bitta tizimda. Jamoa o‘zgarishlarga tez javob beradi.",
    },
  ];

  const demoPosts = [
    {
      slug_ru: "kak-avtomatizirovat-set-magazinov",
      slug_uz: "retail-avtomatizatsiya",
      title_ru: "Как автоматизировать сеть магазинов и не утонуть в хаосе",
      title_uz: "Retail tarmog‘ini avtomatlashtirish: qaerdan boshlash kerak",
      excerpt_ru:
        "Разбираем типичные ошибки ритейла, когда CRM, склад и касса живут отдельно.",
      excerpt_uz:
        "CRM, ombor va kassa alohida yashasa, retailda odatda qanday muammolar chiqadi – batafsil.",
      published_at: new Date(),
    },
  ];

  const serviceTitleKey = isRu ? "title_ru" : "title_uz";
  const serviceShortKey = isRu
    ? "short_description_ru"
    : "short_description_uz";
  const serviceSlugKey = isRu ? "slug_ru" : "slug_uz";

  const caseTitleKey = isRu ? "title_ru" : "title_uz";
  const caseSlugKey = isRu ? "slug_ru" : "slug_uz";

  const postTitleKey = isRu ? "title_ru" : "title_uz";
  const postExcerptKey = isRu ? "excerpt_ru" : "excerpt_uz";
  const postSlugKey = isRu ? "slug_ru" : "slug_uz";

  const reviewTextKey = isRu ? "text_ru" : "text_uz";

  const services = servicesDb.length ? servicesDb : demoServices;
  const cases = casesDb.length ? casesDb : demoCases;
  const reviews = reviewsDb.length ? reviewsDb : demoReviews;
  const posts = postsDb.length ? postsDb : demoPosts;

  const t = {
    hero: {
      kicker: isRu
        ? "POSSIBLE GROUP · АВТОМАТИЗАЦИЯ"
        : "POSSIBLE GROUP · AVTOMATIZATSIYA",
      title: isRu
        ? "Автоматизация бизнеса в Узбекистане: POS, CRM, ERP и интеграции"
        : "O‘zbekistonda biznes avtomatlashtirish: POS, CRM, ERP va integratsiyalar",
      subtitle: isRu
        ? "Possible Group автоматизирует бизнес в Узбекистане: POS, CRM, ERP, склад, доставка, лояльность и интеграции в один управляемый контур, чтобы собственник видел реальные цифры и мог масштабировать сеть."
        : "Possible Group O‘zbekistonda biznesni avtomatlashtiradi: POS, CRM, ERP, ombor, yetkazib berish, sodiqlik va integratsiyalarni bitta boshqariladigan tizimga birlashtiradi — biznes egasiga real raqamlar va o‘sish imkonini beradi.",
      cta: isRu ? "Получить консультацию" : "Konsultatsiya olish",
      stats: [
        {
          value: "50+",
          label: isRu
            ? "проектов по автоматизации"
            : "50+ avtomatlashtirish loyihalari",
        },
        {
          value: "10+",
          label: isRu
            ? "интеграций: Poster, Billz, 1C, МойСклад"
            : "10+ integratsiya: Poster, Billz, 1C, MoyiSklad",
        },
        {
          value: "3",
          label: isRu
            ? "страны, где работают наши решения"
            : "Bizning yechimlar ishlayotgan 3 mamlakat",
        },
      ],
    },
    gallery: {
      title: isRu
        ? "Живые бизнесы, с которыми мы работаем"
        : "Biz ishlayotgan bizneslar",
      subtitle: isRu
        ? "Ритейл, кофейни, dark-kitchen, рестораны, заводы, склады, доставкащики, сети пекарен — мы не делаем абстрактные проекты, только реальный операционный бизнес."
        : "Retail, kofeynyalar, restoranlar, zavodlar, distribyutorlar — biz faqat real operatsion biznes bilan ishlaymiz.",
    },
    services: {
      title: isRu ? "Ключевые решения" : "Asosiy yechimlar",
      all: isRu ? "Все услуги" : "Barcha xizmatlar",
    },
    cases: {
      title: isRu ? "Кейсы" : "Keyslar",
      all: isRu ? "Все кейсы" : "Barcha keyslar",
    },
    reviews: {
      title: isRu ? "Что говорят клиенты" : "Mijozlar fikri",
      all: isRu ? "Все отзывы" : "Barcha sharhlar",
    },
    blog: {
      title: isRu ? "Блог про автоматизацию" : "Avtomatlashtirish blogi",
      all: isRu ? "Все статьи" : "Barcha maqolalar",
    },
    faq: {
      title: isRu ? "Частые вопросы" : "Ko‘p so‘raladigan savollar",
    },
    finalCta: {
      title: isRu
        ? "Хотите навести порядок в цифрах и процессах?"
        : "Jarayon va raqamlarni tartibga keltirmoqchimisiz?",
      text: isRu
        ? "Оставьте заявку на консультацию. Разберём ваши процессы и покажем, где автоматизация даст быстрый эффект."
        : "Konsultatsiyaga so‘rov qoldiring. Jarayonlaringizni tahlil qilib, qayerda tez natija chiqishini ko‘rsatamiz.",
      button: isRu ? "Записаться на консультацию" : "Konsultatsiyaga yozilish",
    },
  };

  // --- JSON-LD structured data for SEO ---
  const baseUrl = "https://possible.uz";

  const faqEntities = [
    {
      question: isRu
        ? "Сколько времени занимает внедрение?"
        : "Joriy etish qancha vaqt oladi?",
      answer: isRu
        ? "Простой проект — от 2–4 недель. Полноценная CRM/ERP с интеграциями — от 1 до 3 месяцев, в зависимости от масштаба сети."
        : "Oddiy loyiha — 2–4 hafta. To‘liq CRM/ERP integratsiyalar bilan — 1–3 oy, tarmoq hajmiga qarab.",
    },
    {
      question: isRu
        ? "Можно начать с пилота на одном объекте?"
        : "Bitta filialdan pilot boshlasak bo‘ladimi?",
      answer: isRu
        ? "Да. Обычно мы сначала автоматизируем один объект или один процесс, считаем эффект, затем масштабируем."
        : "Ha. Odatda avval bitta filial yoki jarayonni avtomatlashtiramiz, natijani o‘lchab keyin kengaytiramiz.",
    },
    {
      question: isRu
        ? "Вы работаете только в Узбекистане?"
        : "Faqat O‘zbekistonda ishlaysizmi?",
      answer: isRu
        ? "Основной фокус — Узбекистан, но мы ведём проекты и в соседних странах, если есть доступ к нужной инфраструктуре."
        : "Asosiy fokus — O‘zbekiston, lekin zarur infratuzilma bo‘lsa, qo‘shni mamlakatlardagi loyihalar bilan ham ishlaymiz.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Possible Group",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      sameAs: [
        "https://t.me/possible_company",
        "https://wa.me/",
        "https://www.instagram.com/possible.uz/",
      ],
      description: t.hero.subtitle,
      address: {
        "@type": "PostalAddress",
        addressCountry: "UZ",
        addressLocality: "Tashkent",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Possible Group",
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntities.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <main className="relative mx-auto max-w-6xl px-4 pb-16 space-y-16 [&>:nth-child(2)]:!mt-0 [&>:nth-child(3)]:!mt-8">
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      {/* фоновые \"огни\" */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />
      </div>

      {/* HERO с фото */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.6fr,1.2fr] mt-0">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-neutral-500">
            {t.hero.kicker}
          </p>
          <h1 className="mb-5 text-3xl font-semibold leading-tight md:text-5xl">
            {t.hero.title}
          </h1>
          <p className="mb-7 text-sm text-neutral-300 md:text-base">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`/${locale}/contact`}
              className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black shadow-lg shadow-white/30 transition hover:bg-neutral-100"
            >
              {t.hero.cta}
            </a>
            <a
              href="https://t.me/possible_company"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm text-neutral-200 backdrop-blur hover:border-white/40"
              rel="noopener noreferrer"
              target="_blank"
            >
              Telegram
            </a>http://localhost:3000/admin/dashboard
          </div>
          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-4 text-xs text-neutral-400">
            {t.hero.stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xl font-semibold text-white">{s.value}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>

          {/* логотипы-«клиенты» */}
          <div className="mt-8 flex flex-wrap gap-4 text-[11px] text-neutral-500">
            <span className="uppercase tracking-[0.24em] text-neutral-400">
              {isRu ? "Нам доверяют:" : "Bizga ishonishadi:"}
            </span>
            <span>· Retail chain</span>
            <span>· Coffee &amp; Bakery</span>
            <span>· Sushi Delivery</span>
          </div>
        </div>

        {/* Фото блок справа */}
        <div className="relative h-[260px] w-full md:h-[320px]">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neutral-900 via-black to-neutral-950 shadow-[0_0_60px_rgba(0,0,0,0.7)]" />
          <Image
            src="/hero-possible.jpg"
            alt={
              isRu
                ? "Команда Possible Group работает над автоматизацией бизнеса"
                : "Possible Group jamoasi biznesni avtomatlashtirish ustida ishlamoqda"
            }
            fill
            className="rounded-3xl object-cover opacity-80"
            priority
          />
          <div className="absolute bottom-4 left-4 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-xs text-neutral-200 backdrop-blur">
            <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
              {isRu ? "Фокус: ритейл и общепит" : "Fokus: retail va umumiy ovqatlanish"}
            </div>
            <div className="mt-1">
              {isRu
                ? "POS, CRM, склад, доставка, бонусы и аналитика — в одном управляемом контуре."
                : "POS, CRM, ombor, yetkazib berish, bonuslar va analitika — bitta boshqariladigan yechimda."}
            </div>
          </div>
        </div>
      </section>

      {/* ГАЛЕРЕЯ / ФОТО БИЗНЕСОВ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">{t.gallery.title}</h2>
          <p className="mt-1 text-sm text-neutral-400">{t.gallery.subtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <GalleryCard
            locale={locale}
            src="/gallery-retail.jpg"
            labelRu="Ритейл-полка"
            labelUz="Retail do‘konlar"
            textRu="Автоматизация сети магазинов: остатки и продажи по каждому SKU в онлайне."
            textUz="Do‘konlar tarmog‘ida avtomatlashtirish: har bir SKU bo‘yicha onlayn qoldiq va savdo."
          />
          <GalleryCard
            locale={locale}
            src="/gallery-coffee.jpg"
            labelRu="Horeca / кофейни"
            labelUz="Horeca / kofeynyalar"
            textRu="Единая система лояльности и заказов: зал, доставку и агрегаторы видит владелец."
            textUz="Marketing va buyurtmalar tizimi: zal, yetkazib berish va agregatorlar egaga ko‘rinadi."
          />
          <GalleryCard
            locale={locale}
            src="/gallery-hms.jpg"
            labelRu="Дистрибьюторы / оптовики"
            labelUz="Distributorlar / ulgurji savdo"
            textRu="Полный контроль склада, автоматизация заказов от точек, остатки в реальном времени и удобная работа с прайсами."
            textUz="Ombor to‘liq nazoratda, nuqtalardan buyurtmalar avtomatlashtiriladi, real vaqtli qoldiq va qulay narxlar boshqaruvi."
          />
        </div>
      </section>

      {/* УСЛУГИ */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">{t.services.title}</h2>
          <a
            href={`/${locale}/services`}
            className="text-xs text-neutral-300 underline underline-offset-4"
          >
            {t.services.all}
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((s: any, index) => (
            <a
              key={s.id ?? s.slug ?? index}
              href={`/${locale}/services/${(s as any)[serviceSlugKey] ?? s.slug}`}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-neutral-950/80 p-4 shadow-[0_0_40px_rgba(0,0,0,0.6)] transition hover:border-cyan-400/60 hover:shadow-[0_0_50px_rgba(34,211,238,0.35)]"
            >
              <h3 className="mb-2 text-sm font-semibold text-white">
                {(s as any)[serviceTitleKey] ?? s.title_ru ?? s.title_uz}
              </h3>
              <p className="line-clamp-4 text-xs text-neutral-400">
                {(s as any)[serviceShortKey] ?? s.short_ru ?? s.short_uz}
              </p>
              <span className="mt-4 inline-flex text-[11px] text-cyan-300 group-hover:text-cyan-200">
                {isRu ? "Подробнее" : "Batafsil"} →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* КЕЙСЫ */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">{t.cases.title}</h2>
          <a
            href={`/${locale}/cases`}
            className="text-xs text-neutral-300 underline underline-offset-4"
          >
            {t.cases.all}
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c: any, index) => (
            <a
              key={c.id ?? c.slug_ru ?? index}
              href={`/${locale}/cases/${(c as any)[caseSlugKey] ?? c.slug_ru}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-4 transition hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(52,211,153,0.3)]"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">
                {c.industry}
              </div>
              <h3 className="mt-2 text-sm font-semibold text-white">
                {(c as any)[caseTitleKey]}
              </h3>
              <p className="mt-1 line-clamp-3 text-xs text-neutral-400">
                {c.client_name}
              </p>
              <span className="mt-4 text-[11px] text-emerald-300 group-hover:text-emerald-200">
                {isRu ? "Смотреть результат" : "Natijani ko‘rish"} →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ОТЗЫВЫ + БЛОГ */}
      <section className="grid gap-10 lg:grid-cols-[1.4fr,1fr]">
        {/* отзывы */}
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold">{t.reviews.title}</h2>
            <a
              href={`/${locale}/reviews`}
              className="text-xs text-neutral-300 underline underline-offset-4"
            >
              {t.reviews.all}
            </a>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {reviews.map((r: any) => (
              <figure
                key={r.id}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-neutral-950/90 p-4"
              >
                <div className="mb-2 text-xs text-amber-300">
                  {"★".repeat(r.rating ?? 5)}{" "}
                  <span className="text-[10px] text-neutral-400">/ 5</span>
                </div>
                <blockquote className="text-xs text-neutral-200">
                  {(r as any)[reviewTextKey]}
                </blockquote>
                <figcaption className="mt-3 text-[11px] text-neutral-400">
                  {r.client_name}
                  {r.company ? ` · ${r.company}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* блог */}
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold">{t.blog.title}</h2>
            <a
              href={`/${locale}/blog`}
              className="text-xs text-neutral-300 underline underline-offset-4"
            >
              {t.blog.all}
            </a>
          </div>
          <div className="space-y-3">
            {posts.map((p: any, index) => (
              <a
                key={p.id ?? p.slug_ru ?? index}
                href={`/${locale}/blog/${(p as any)[postSlugKey] ?? p.slug_ru}`}
                className="block rounded-2xl border border-white/10 bg-neutral-950/80 p-4 hover:border-sky-400/60"
              >
                <div className="text-[11px] text-neutral-500">
                  {p.published_at
                    ? new Date(p.published_at).toLocaleDateString(
                        isRu ? "ru-RU" : "uz-UZ"
                      )
                    : ""}
                </div>
                <h3 className="mt-1 text-sm font-semibold text-white">
                  {(p as any)[postTitleKey] ?? p.title_ru ?? p.title_uz}
                </h3>
                <p className="mt-1 text-xs text-neutral-400">
                  {(p as any)[postExcerptKey] ?? p.excerpt_ru ?? p.excerpt_uz}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ (статический) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t.faq.title}</h2>
        <dl className="space-y-3 text-xs text-neutral-300">
          <FaqItem q={faqEntities[0].question} a={faqEntities[0].answer} />
          <FaqItem q={faqEntities[1].question} a={faqEntities[1].answer} />
          <FaqItem q={faqEntities[2].question} a={faqEntities[2].answer} />
        </dl>
      </section>

      {/* финальный CTA */}
      <section className="rounded-3xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 p-[1px]">
        <div className="rounded-[22px] bg-black/80 px-6 py-6 md:px-8 md:py-8">
          <div className="grid gap-4 md:grid-cols-[2fr,1fr] md:items-center">
            <div>
              <h2 className="text-xl font-semibold">{t.finalCta.title}</h2>
              <p className="mt-2 text-sm text-neutral-300">
                {t.finalCta.text}
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <a
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-medium text-black shadow-lg shadow-white/30 hover:bg-neutral-100"
              >
                {t.finalCta.button}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- маленькие подкомпоненты ---

function GalleryCard(props: {
  locale: Locale;
  src: string;
  labelRu: string;
  labelUz: string;
  textRu: string;
  textUz: string;
}) {
  const isRu = props.locale === "ru";
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80">
      <div className="relative h-40 w-full">
        <Image
          src={props.src}
          alt={isRu ? props.labelRu : props.labelUz}
          fill
          className="object-cover opacity-90 transition group-hover:scale-105"
        />
      </div>
      <div className="p-4 text-xs">
        <div className="text-[11px] font-semibold text-white">
          {isRu ? props.labelRu : props.labelUz}
        </div>
        <p className="mt-1 text-neutral-300">
          {isRu ? props.textRu : props.textUz}
        </p>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-4">
      <dt className="text-sm font-semibold text-white">{q}</dt>
      <dd className="mt-1 text-xs text-neutral-300">{a}</dd>
    </div>
  );
}
