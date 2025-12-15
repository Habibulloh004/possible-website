import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";

const BASE_URL = "https://possible.uz";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const localeParam = params.locale;
  const isRu = localeParam === "ru";

  const title = isRu
    ? "О Possible Group — автоматизация бизнеса в Узбекистане"
    : "Possible Group haqida — O‘zbekistonda biznes avtomatlashtirish";
  const description = isRu
    ? "Possible Group — продуктовая команда из Узбекистана. Автоматизируем розницу, общепит, дистрибуцию и онлайн‑бизнес: POS, CRM, ERP, integratsiyalar va analitika bir ekotizimda."
    : "Possible Group — O‘zbekistondagi mahsulot jamoasi. Retail, umumiy ovqatlanish, distributsiya va onlayn biznes uchun POS, CRM, ERP, integratsiyalar va analitikani yagona ekotizimga yig‘amiz.";

  const keywords = isRu
    ? [
        "автоматизация бизнеса",
        "автоматизация Узбекистан",
        "POS система Узбекистан",
        "CRM для ритейла",
        "ERP для общепита",
        "интеграции касса эквайринг",
        "Possible Group",
        "IT компания Ташкент",
        "CRM ERP POS Узбекистан",
      ]
    : [
        "biznes avtomatlashtirish",
        "POS tizim O‘zbekiston",
        "CRM tizim retail",
        "ERP umumiy ovqatlanish",
        "integratsiya kassalar ekvayring",
        "Possible Group",
        "IT kompaniya Toshkent",
        "CRM ERP POS O‘zbekiston",
      ];

  const canonical =
    localeParam === "uz"
      ? `${BASE_URL}/uz/about`
      : `${BASE_URL}/ru/about`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        "ru-UZ": `${BASE_URL}/ru/about`,
        "uz-UZ": `${BASE_URL}/uz/about`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-12 space-y-10">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="absolute right-0 top-72 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Hero */}
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          {isRu
            ? "Делаем бизнес предсказуемым: цифры честные, процессы под контролем"
            : "Biznesni oldinga olib chiqadigan raqamlar va jarayonlar yaratamiz"}
        </h1>

        <p className="max-w-3xl text-sm md:text-base text-neutral-300">
          {isRu
            ? "Possible Group — продуктовая команда из Узбекистана. Мы создаём веб‑сайты, мобильные приложения, Telegram‑боты, POS, CRM, ERP и интеграции, чтобы у собственника был один понятный цифровой контур вместо хаоса из Excel и разных программ."
            : "Possible Group — O‘zbekistondagi kuchli jamoa. Biz web saytlar, mobil ilovalar, Telegram botlar, POS, CRM, ERP va turli integratsiyalarni bitta ekotizimga yig‘ib, biznes egasiga Excel va turli dasturlar o‘rniga yagona raqamli tizim beramiz."}
        </p>
      </header>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-3 text-sm">
        <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-4">
          <div className="text-[11px] text-neutral-400">
            {isRu ? "Фокус" : "Fokus"}
          </div>
          <div className="mt-1 text-xl font-semibold">
            {isRu ? "Автоматизация бизнеса" : "Biznes avtomatlashtirish"}
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            {isRu
              ? "Ритейл, общепит, дистрибуция, сервис — там, где важны скорость и контроль."
              : "Retail, umumiy ovqatlanish, distributsiya va servis — tezlik va nazorat muhim bo‘lgan joylar."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-4">
          <div className="text-[11px] text-neutral-400">
            {isRu ? "Подход" : "Yondashuv"}
          </div>
          <div className="mt-1 text-xl font-semibold">
            Discovery → Design → Dev → Support
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            {isRu
              ? "Сначала считаем экономику и проектируем процессы, потом пишем код и остаёмся на поддержке."
              : "Avval iqtisod va jarayonlarni loyihalashtiramiz, keyin kod yozamiz va qo‘llab-quvvatlaymiz."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-4">
          <div className="text-[11px] text-neutral-400">
            {isRu ? "Амбиции" : "Ambitsiya"}
          </div>
          <div className="mt-1 text-xl font-semibold">
            {isRu
              ? "Top‑1% по автоматизации"
              : "Avtomatlashtirish bo‘yicha top‑1%"}
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            {isRu
              ? "Цель — стать №1 выбором по автоматизации для предпринимателей Узбекистана и региона."
              : "Maqsad — O‘zbekiston va mintaqadagi tadbirkorlar uchun avtomatlashtirish bo‘yicha birinchi tanlov bo‘lish."}
          </p>
        </div>
      </section>

      {/* Who we work with / What we do */}
      <section className="grid gap-6 md:grid-cols-2 text-sm">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            {isRu ? "С кем мы работаем" : "Kimlar bilan ishlaymiz"}
          </h2>
          <p className="text-xs text-neutral-400">
            {isRu
              ? "Нам проще всего принести результат там, где есть обороты и хаос в учёте."
              : "Ayniqsa aylanma bor, lekin hisob-kitob va jarayonlarda tartib yo‘q bo‘lgan joylarda samarali bo‘lamiz."}
          </p>
          <ul className="mt-2 space-y-2 text-sm text-neutral-200">
            <li>• {isRu ? "Ритейл-точки и сети магазинов" : "Retail nuqtalar va do‘kon tarmoqlari"}</li>
            <li>• {isRu ? "Кафе, рестораны, dark‑kitchen" : "Kafe, restoranlar, dark‑kitchen formatlar"}</li>
            <li>• {isRu ? "Дистрибьюторы и оптовые компании" : "Distributsion va ulgurji kompaniyalar"}</li>
            <li>• {isRu ? "Онлайн‑проекты и маркетплейсы" : "Onlayn loyihalar va marketplace lar"}</li>
          </ul>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            {isRu ? "Что именно делаем" : "Nimani qilamiz"}
          </h2>
          <p className="text-xs text-neutral-400">
            {isRu
              ? "Не продаём «программу». Собираем систему вокруг задач бизнеса."
              : "Biz shunchaki “dastur” sotmaymiz — biznes muammosi atrofida tizim quramiz."}
          </p>
          <ul className="mt-2 space-y-2 text-sm text-neutral-200">
            <li>• {isRu ? "POS-системы с учётом локальной специфики" : "Mahalliy bozor uchun moslashgan POS tizimlar"}</li>
            <li>• {isRu ? "CRM и лёгкие ERP для владельца" : "Egalar uchun qulay CRM va yengil ERP"}</li>
            <li>• {isRu ? "Интеграции с банк‑эквайрингом, кассами, маркетплейсами" : "Bank ekvayring, kassa va marketplace integratsiyalari"}</li>
            <li>• {isRu ? "Сервисы аналитики и отчётности «в один клик»" : "Bir necha bosishda tayyor bo‘lgan analitika va hisobotlar"}</li>
          </ul>
        </div>
      </section>

      {/* Principles */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
          {isRu ? "Принципы работы" : "Ish tamoyillarimiz"}
        </h2>
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-4">
            <div className="text-lg">📊</div>
            <div className="mt-2 text-sm font-semibold">
              {isRu ? "Считаем эффект" : "Natijani hisoblaymiz"}
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              {isRu
                ? "Смотрим, как автоматизация влияет на выручку, маржу и загрузку команды."
                : "Avtomatlashtirish tushum, marja va jamoa yuklamasiga qanday ta’sir qilishini ko‘rsatamiz."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-4">
            <div className="text-lg">🧩</div>
            <div className="mt-2 text-sm font-semibold">
              {isRu ? "Не ломаем бизнес" : "Biznesni buzmaymiz"}
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              {isRu
                ? "Встраиваемся в текущие процессы и улучшаем их, а не заставляем «жить по софту»."
                : "Mavjud jarayonlarga moslashamiz va ularni yaxshilaymiz, hammani “dasturga moslashishga” majburlamaymiz."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-4">
            <div className="text-lg">🤝</div>
            <div className="mt-2 text-sm font-semibold">
              {isRu ? "Долгая партнёрская история" : "Uzoq muddatli hamkorlik"}
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              {isRu
                ? "Поддерживаем, дорабатываем и масштабируем систему вместе с ростом компании."
                : "Kompaniya o‘sgani sari tizimni birga rivojlantiramiz va kengaytiramiz."}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-sky-500/10 p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-white">
              {isRu
                ? "Хотите навести порядок в цифрах и процессах?"
                : "Raqamlar va jarayonlarda tartib bo‘lishini xohlaysizmi?"}
            </h2>
            <p className="mt-1 text-xs md:text-sm text-emerald-50/80">
              {isRu
                ? "Опишите, как сейчас работает ваш бизнес, — предложим, что автоматизировать в первую очередь."
                : "Biznesingiz hozir qanday ishlayotganini yozing — birinchi navbatda nimalarni avtomatlashtirish kerakligini taklif qilamiz."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs md:text-sm font-medium text-black shadow hover:bg-neutral-100"
            >
              {isRu ? "Записаться на консультацию" : "Konsultatsiyaga yozilish"}
            </a>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Possible Group",
            url: BASE_URL,
            description: isRu
              ? "Possible Group — ведущая команда по автоматизации бизнеса в Узбекистане: создаём POS, CRM, ERP, интеграции, аналитические сервисы и полноценные цифровые экосистемы."
              : "Possible Group — O‘zbekistonda biznes avtomatlashtirish bo‘yicha yetakchi jamoa: POS, CRM, ERP, integratsiyalar, analitika va to‘liq raqamli ekotizimlar yaratamiz.",
            address: {
              "@type": "PostalAddress",
              addressCountry: "UZ",
            },
            sameAs: [
              "https://www.instagram.com/possible_group", // при желании позже поменяешь на реальные ссылки
            ],
          }),
        }}
      />
    </div>
  );
}
