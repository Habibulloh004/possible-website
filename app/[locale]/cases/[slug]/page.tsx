import { prisma } from "@/lib/prisma";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata, ResolvingMetadata } from "next";

// Revalidate individual case pages every 60 minutes
export const revalidate = 3600;

export async function generateStaticParams() {
  const cases = await prisma.case.findMany({
    select: { slug_ru: true, slug_uz: true },
  });

  return cases.flatMap((c) => [
    { locale: "ru", slug: c.slug_ru },
    { locale: "uz", slug: c.slug_uz },
  ]);
}

// SEO: generateMetadata для кейса
export async function generateMetadata(
  { params }: { params: { locale: string; slug: string } },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";

  const c = await prisma.case.findFirst({
    where: {
      OR: [{ slug_ru: params.slug }, { slug_uz: params.slug }],
    },
  });

  if (!c) {
    return {
      title: "Кейс не найден | Possible Group",
      robots: { index: false, follow: false },
    };
  }

  const titleContent = isRu ? c.title_ru : c.title_uz;
  const descriptionContent = isRu ? c.description_ru : c.description_uz;

  const metaTitle = isRu ? c.meta_title_ru : c.meta_title_uz;
  const metaDescription = isRu
    ? c.meta_description_ru
    : c.meta_description_uz;

  const ogTitle = isRu ? c.og_title_ru : c.og_title_uz;
  const ogDescription = isRu
    ? c.og_description_ru
    : c.og_description_uz;

  const rawKeywords = isRu ? c.meta_keywords_ru : c.meta_keywords_uz;
  const keywords = rawKeywords
    ? rawKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined;

  const baseUrl = "https://possible.uz";
  const canonical =
    c.canonical_url ||
    `${baseUrl}/${isRu ? "ru" : "uz"}/cases/${isRu ? c.slug_ru : c.slug_uz}`;

  const allowIndex = c.index ?? true;

  return {
    title: metaTitle || titleContent || "Кейс | Possible Group",
    description:
      metaDescription ||
      descriptionContent ||
      "Кейс по автоматизации бизнеса от Possible Group.",
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle || metaTitle || titleContent || "Кейс | Possible Group",
      description:
        ogDescription ||
        metaDescription ||
        descriptionContent ||
        "Кейс по автоматизации бизнес-процессов.",
      url: canonical,
      type: "article",
      images: c.og_image
        ? [
            {
              url: c.og_image,
            },
          ]
        : undefined,
    },
    robots: {
      index: allowIndex,
      follow: allowIndex,
    },
  };
}

export default async function CasePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";

  const c = await prisma.case.findFirst({
    where: {
      OR: [{ slug_ru: params.slug }, { slug_uz: params.slug }],
    },
  });

  if (!c) notFound();

  const title = isRu ? c.title_ru : c.title_uz;
  const problem = isRu ? c.problem_ru : c.problem_uz;
  const solution = isRu ? c.solution_ru : c.solution_uz;
  const result = isRu ? c.result_ru : c.result_uz;
  const description = isRu ? c.description_ru : c.description_uz;

  // поддерживаем и одиночный URL, и JSON-массив
  let screenshots: string[] = [];
  if (c.screenshots) {
    const raw = c.screenshots.trim();
    if (raw.startsWith("[")) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          screenshots = parsed.filter((x) => typeof x === "string");
        }
      } catch {
        // если строка невалидный JSON — игнорируем
      }
    } else {
      screenshots = [raw];
    }
  }

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-14 space-y-12">
      {/* фоновые акценты */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute right-0 top-80 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      </div>

      {/* HERO */}
      <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-950 via-neutral-950/95 to-neutral-900/80 p-6 md:p-8 shadow-[0_0_45px_rgba(15,23,42,0.8)]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1.1fr)] items-start">
          {/* left: main info */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300">
              {c.industry && (
                <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-100">
                  {c.industry}
                </span>
              )}

              {(c.client_name || c.launch_date) && (
                <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
                  {c.client_name && <span>{c.client_name}</span>}
                  {c.client_name && c.launch_date && <span>·</span>}
                  {c.launch_date && (
                    <span>
                      {new Date(c.launch_date).toLocaleDateString("ru-RU")}
                    </span>
                  )}
                </span>
              )}
            </div>

            {description && (
              <p className="max-w-2xl text-sm md:text-[15px] text-neutral-300">
                {description}
              </p>
            )}
          </div>

          {/* right: hero screenshot (если есть) */}
          {screenshots[0] && (
            <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/80">
              <Image
                src={screenshots[0]}
                alt={title}
                fill
                className="object-cover transition duration-500 hover:scale-[1.03]"
              />
            </div>
          )}
        </div>
      </header>

      {/* PROBLEM / SOLUTION / RESULT */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="space-y-3 rounded-2xl border border-rose-500/40 bg-neutral-950/95 p-5 shadow-[0_0_30px_rgba(190,18,60,0.25)]">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-300">
            {isRu ? "Проблема" : "Muammo"}
          </h2>
          <p className="text-sm text-neutral-100 whitespace-pre-line">
            {problem}
          </p>
        </div>
        <div className="space-y-3 rounded-2xl border border-sky-500/40 bg-neutral-950/95 p-5 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            {isRu ? "Решение" : "Yechim"}
          </h2>
          <p className="text-sm text-neutral-100 whitespace-pre-line">
            {solution}
          </p>
        </div>
        <div className="space-y-3 rounded-2xl border border-emerald-500/40 bg-neutral-950/95 p-5 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {isRu ? "Результат" : "Natija"}
          </h2>
          <p className="text-sm text-neutral-100 whitespace-pre-line">
            {result}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-2">
        <div className="w-full rounded-3xl border border-white/10 bg-neutral-950/95 p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.65)]">
          <h3 className="mb-2 text-sm font-semibold text-white">
            {isRu
              ? "Хотите похожий результат?"
              : "Shunga o‘xshash natija xohlaysizmi?"}
          </h3>
          <p className="mb-5 text-sm text-neutral-300">
            {isRu
              ? "Кратко опишите ваш бизнес, и мы покажем, какие решения из этого кейса можно применить именно у вас."
              : "Biznesingizni qisqacha yozing — shu keysdagi yechimlarning qaysi qismini aynan sizda qo‘llash mumkinligini taklif qilamiz."}
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black hover:bg-neutral-100"
          >
            {isRu ? "Обсудить проект" : "Loyihani muhokama qilish"}
          </a>
        </div>
      </section>
    </div>
  );
}
