import { prisma } from "@/lib/prisma";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { is_published: true },
    select: { slug_ru: true, slug_uz: true },
  });

  return posts.flatMap((post) => [
    { locale: "ru", slug: post.slug_ru },
    { locale: "uz", slug: post.slug_uz },
  ]);
}

async function getPostBySlug(locale: Locale, slug: string) {
  const post = await prisma.post.findFirst({
    where: {
      is_published: true,
      OR: [{ slug_ru: slug }, { slug_uz: slug }],
    },
  });

  if (!post) return null;

  const isRu = locale === "ru";

  const title = isRu ? post.title_ru : post.title_uz;
  const excerpt = isRu ? post.excerpt_ru : post.excerpt_uz;
  const content = isRu ? post.content_ru : post.content_uz;

  const rawTags = post.tags
    ? (post.tags as string)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const rawMetaKeywords = isRu ? post.meta_keywords_ru : post.meta_keywords_uz;
  const metaKeywords = rawMetaKeywords
    ? rawMetaKeywords
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return {
    post,
    isRu,
    title,
    excerpt,
    content,
    tags: rawTags,
    metaKeywords,
  };
}

// SEO: динамические meta-теги для статьи
export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const data = await getPostBySlug(locale, params.slug);
  if (!data) return {};

  const { post, isRu, title, excerpt, metaKeywords, tags } = data;

  const metaTitle =
    (isRu ? post.meta_title_ru : post.meta_title_uz) || title || "";
  const metaDescription =
    (isRu ? post.meta_description_ru : post.meta_description_uz) ||
    excerpt ||
    "";
  const keywords = [...metaKeywords, ...tags];

  const canonical =
    post.canonical_url ||
    `https://possible.uz/${locale}/blog/${isRu ? post.slug_ru : post.slug_uz}`;

  const ogImage = post.og_image || undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords.length ? keywords : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: metaTitle,
      description: metaDescription,
      url: canonical,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
    },
    robots: {
      index: post.index ?? true,
      follow: post.index ?? true,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const data = await getPostBySlug(locale, params.slug);

  if (!data) notFound();

  const { post, isRu, title, excerpt, content, tags } = data;

  const paragraphs = content
    ? content
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const hasCover = !!post.og_image;

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-10 space-y-10">
      {/* Фоновая подсветка */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="absolute right-0 top-80 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl" />
      </div>

      {/* Хлебные крошки / возврат */}
      <div className="text-xs text-neutral-500">
        <a
          href={`/${locale}/blog`}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-neutral-200 hover:border-sky-400/60 hover:text-white"
        >
          ← {isRu ? "Назад в блог" : "Blogga qaytish"}
        </a>
      </div>

      {/* Хедер статьи */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-neutral-400">
          {post.published_at && (
            <span className="h-1 w-1 rounded-full bg-neutral-500" />
          )}
          {post.published_at && (
            <span className="normal-case tracking-normal text-[10px]">
              {new Date(post.published_at).toLocaleDateString("ru-RU")}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          {title}
        </h1>

        {excerpt && (
          <p className="max-w-2xl text-sm md:text-base text-neutral-300">
            {excerpt}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-sky-400/40 bg-sky-500/10 px-2.5 py-0.5 text-[10px] text-sky-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Обложка статьи */}
      {hasCover && (
        <div className="relative h-56 w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 md:h-80">
          <Image
            src={post.og_image as string}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>
      )}

      {/* Контент статьи */}
      <article className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:text-white prose-a:text-sky-300 prose-a:no-underline hover:prose-a:text-sky-200 prose-strong:text-white prose-li:marker:text-neutral-400">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p className="text-neutral-500">
            {isRu
              ? "Контент статьи пока пуст. Добавь текст в админке."
              : "Maqola matni hali yo‘q. Uni admin orqali qo‘shing."}
          </p>
        )}
      </article>

      {/* Небольшой CTA в конце */}
      <section className="mt-6 rounded-3xl border border-white/10 bg-neutral-950/80 p-5 md:p-6">
        <h2 className="text-sm md:text-base font-semibold text-white">
          {isRu
            ? "Хотите применить это в своём бизнесе?"
            : "Buni biznesingizda qo‘llamoqchimisiz?"}
        </h2>
        <p className="mt-2 text-xs md:text-sm text-neutral-300">
          {isRu
            ? "Оставьте заявку, и мы подскажем, как адаптировать решения из статьи под вашу нишу и текущий уровень бизнеса."
            : "Ariza qoldiring — maqoladagi yechimlarni aynan sizning biznes modelingizga moslashtirishga yordam beramiz."}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs md:text-sm font-medium text-black hover:bg-neutral-100"
          >
            {isRu ? "Записаться на консультацию" : "Konsultatsiya olish"}
          </a>
        </div>
      </section>
    </div>
  );
}
