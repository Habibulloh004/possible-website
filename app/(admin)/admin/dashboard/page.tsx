// app/(admin)/admin/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Базовая статистика контента
  let servicesCount = 0;
  let casesCount = 0;
  let postsCount = 0;
  let categoriesCount = 0;
  let reviewsCount = 0;

  // Последние изменения
  let latestPosts: any[] = [];
  let latestCases: any[] = [];

  try {
    servicesCount = await prisma.service.count();
  } catch {
    servicesCount = 0;
  }

  try {
    casesCount = await prisma.case.count();
  } catch {
    casesCount = 0;
  }

  try {
    postsCount = await prisma.post.count();
  } catch {
    postsCount = 0;
  }

  try {
    categoriesCount = await prisma.category.count();
  } catch {
    categoriesCount = 0;
  }

  try {
    reviewsCount = await prisma.review.count();
  } catch {
    reviewsCount = 0;
  }

  try {
    latestPosts = await prisma.post.findMany({
      orderBy: { published_at: "desc" },
      take: 5,
    });
  } catch {
    latestPosts = [];
  }

  try {
    latestCases = await prisma.case.findMany({
      orderBy: { launch_date: "desc" },
      take: 5,
    });
  } catch {
    latestCases = [];
  }

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Быстрая сводка по контенту сайта Possible Group: услуги, кейсы,
            блог, отзывы и настройки SEO.
          </p>
        </div>
        <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
          Admin · Possible Group
        </span>
      </header>

      {/* Карточки со статистикой */}
      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Услуги"
          value={servicesCount}
          href="/admin/services"
          hint="Каждая услуга = отдельная SEO-страница (landing)."
        />
        <StatCard
          label="Кейсы"
          value={casesCount}
          href="/admin/cases"
          hint="Портфолио: реальные проекты и результаты."
        />
        <StatCard
          label="Статьи блога"
          value={postsCount}
          href="/admin/blog"
          hint="Экспертный контент для SEO и доверия."
        />
        <StatCard
          label="Категории блога"
          value={categoriesCount}
          href="/admin/categories"
          hint="Структура блога и кластеры SEO-запросов."
        />
        <StatCard
          label="Отзывы"
          value={reviewsCount}
          href="/admin/reviews"
          hint="Социальное доказательство на лендингах."
        />
      </section>

      {/* Быстрые действия */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        {/* Быстрый доступ к разделам */}
        <div className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Быстрый старт работы с контентом
          </h2>
          <p className="text-xs text-neutral-400">
            Начни с основных страниц, которые сильнее всего влияют на SEO и
            продажи: услуги, кейсы, блог и контактная страница.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <QuickLink
              href="/admin/services"
              title="Услуги"
              description="Добавь или обнови услуги: «Автоматизация бизнеса», «Интеграции Poster / Billz / 1C» и т.д."
            />
            <QuickLink
              href="/admin/cases"
              title="Кейсы"
              description="Опиши реальные проекты, цифры и результаты — это сильно влияет на продажи."
            />
            <QuickLink
              href="/admin/blog"
              title="Блог"
              description="Публикуй экспертные статьи по автоматизации, CRM, ERP, POS, интеграциям."
            />
            <QuickLink
              href="/admin/settings"
              title="Настройки сайта"
              description="Контакты, социальные сети, глобальные meta-теги и аналитика."
            />
          </div>
        </div>

        {/* SEO чек-лист */}
        <div className="space-y-3 rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/15 via-neutral-950 to-purple-500/10 p-5">
          <h2 className="text-sm font-semibold text-white">SEO-фокус</h2>
          <p className="text-xs text-neutral-100">
            Чтобы сайт Possible Group стабильно рос в поиске, следи за
            простыми правилами:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-neutral-100">
            <li>• У каждой услуги: уникальные title/description на RU и UZ.</li>
            <li>• Кейсы: конкретные цифры и отрасль (ритейл, HoReCa, delivery).</li>
            <li>• Статьи: один основной ключевой запрос на страницу.</li>
            <li>• Заполняй OpenGraph-изображения для соцсетей.</li>
            <li>• Не оставляй черновой контент без доработки meta-тегов.</li>
          </ul>
          <p className="mt-3 text-[11px] text-neutral-200">
            Детальная настройка SEO-полей доступна в карточках услуг, кейсов,
            статей и категорий.
          </p>
        </div>
      </section>

      {/* Последние изменения */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Последние статьи */}
        <div className="rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              Последние статьи блога
            </h2>
            <Link
              href="/admin/blog"
              className="text-[11px] text-neutral-300 underline underline-offset-4"
            >
              Открыть блог
            </Link>
          </div>

          {latestPosts.length === 0 ? (
            <p className="text-xs text-neutral-500">
              Пока нет статей. Создай первую запись в разделе «Блог».
            </p>
          ) : (
            <ul className="space-y-2 text-xs">
              {latestPosts.map((post) => (
                <li
                  key={post.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-white/5 bg-black/40 p-3"
                >
                  <div>
                    <div className="font-medium text-white">
                      {post.title_ru || post.title_uz}
                    </div>
                    <div className="mt-1 text-[11px] text-neutral-400">
                      {post.slug_ru || post.slug_uz}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-neutral-500">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("ru-RU")
                      : "черновик"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Последние кейсы */}
        <div className="rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              Последние кейсы
            </h2>
            <Link
              href="/admin/cases"
              className="text-[11px] text-neutral-300 underline underline-offset-4"
            >
              Открыть кейсы
            </Link>
          </div>

          {latestCases.length === 0 ? (
            <p className="text-xs text-neutral-500">
              Кейсов пока нет. Добавь хотя бы 2–3 проекта с цифрами — это сильно
              повышает конверсию.
            </p>
          ) : (
            <ul className="space-y-2 text-xs">
              {latestCases.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-white/5 bg-black/40 p-3"
                >
                  <div>
                    <div className="font-medium text-white">
                      {item.title_ru || item.title_uz}
                    </div>
                    <div className="mt-1 text-[11px] text-neutral-400">
                      {item.client_name} · {item.industry}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-neutral-500">
                    {item.launch_date
                      ? new Date(item.launch_date).toLocaleDateString("ru-RU")
                      : "без даты"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

// --- Мелкие компоненты ---

function StatCard({
  label,
  value,
  href,
  hint,
}: {
  label: string;
  value: number;
  href: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-neutral-950/80 p-4 shadow-[0_0_30px_rgba(0,0,0,0.6)] transition hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(34,211,238,0.35)]"
    >
      <div className="text-[11px] text-neutral-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      <p className="mt-2 text-[11px] text-neutral-500 line-clamp-2">{hint}</p>
      <span className="mt-3 text-[11px] text-cyan-300 group-hover:text-cyan-200">
        Открыть раздел →
      </span>
    </Link>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-2xl border border-white/10 bg-black/60 p-3 text-xs transition hover:border-cyan-400/60"
    >
      <span className="text-sm font-semibold text-white">{title}</span>
      <span className="mt-1 text-neutral-400">{description}</span>
    </Link>
  );
}
