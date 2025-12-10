// app/(admin)/admin/blog/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

// SERVER ACTION
async function savePost(formData: FormData) {
  "use server";

  const idRaw = formData.get("id")?.toString();
  const isNew = !idRaw;
  const postId = idRaw ? Number(idRaw) : null;

  if (!isNew && (postId === null || Number.isNaN(postId))) {
    throw new Error("Некорректный ID поста");
  }

  const slug_ru = formData.get("slug_ru")?.toString().trim() || "";
  const slug_uz = formData.get("slug_uz")?.toString().trim() || "";

  const title_ru = formData.get("title_ru")?.toString().trim() || "";
  const title_uz = formData.get("title_uz")?.toString().trim() || "";

  const excerpt_ru = formData.get("excerpt_ru")?.toString().trim() || "";
  const excerpt_uz = formData.get("excerpt_uz")?.toString().trim() || "";

  const content_ru = formData.get("content_ru")?.toString().trim() || "";
  const content_uz = formData.get("content_uz")?.toString().trim() || "";

  const tags = formData.get("tags")?.toString().trim() || "";

  const categoryIdRaw = formData.get("categoryId")?.toString() || "";
  const categoryId = categoryIdRaw ? Number(categoryIdRaw) : null;

  const is_published = formData.get("is_published") === "on";
  const published_at_raw = formData.get("published_at")?.toString() || "";
  const published_at =
    is_published && published_at_raw
      ? new Date(published_at_raw)
      : is_published
      ? new Date()
      : null;

  const meta_title_ru = formData.get("meta_title_ru")?.toString() || "";
  const meta_title_uz = formData.get("meta_title_uz")?.toString() || "";

  const meta_description_ru =
    formData.get("meta_description_ru")?.toString() || "";
  const meta_description_uz =
    formData.get("meta_description_uz")?.toString() || "";

  const meta_keywords_ru =
    formData.get("meta_keywords_ru")?.toString() || "";
  const meta_keywords_uz =
    formData.get("meta_keywords_uz")?.toString() || "";

  const canonical_url = formData.get("canonical_url")?.toString() || "";

  const og_title_ru = formData.get("og_title_ru")?.toString() || "";
  const og_title_uz = formData.get("og_title_uz")?.toString() || "";

  const og_description_ru =
    formData.get("og_description_ru")?.toString() || "";
  const og_description_uz =
    formData.get("og_description_uz")?.toString() || "";

  const og_image = formData.get("og_image")?.toString() || "";

  const indexFlag = formData.get("index") === "on";
  const sitemap_priority = Number(
    formData.get("sitemap_priority")?.toString() || "0.7",
  );
  const sitemap_changefreq =
    formData.get("sitemap_changefreq")?.toString() || "weekly";

  if (!slug_ru || !slug_uz) {
    throw new Error("Slug RU и Slug UZ обязательны");
  }

  if (!title_ru && !title_uz) {
    throw new Error("Нужен хотя бы один заголовок (RU или UZ)");
  }

  const data = {
    slug_ru,
    slug_uz,
    title_ru,
    title_uz,
    excerpt_ru,
    excerpt_uz,
    content_ru,
    content_uz,
    tags,
    is_published,
    published_at,
    meta_title_ru,
    meta_title_uz,
    meta_description_ru,
    meta_description_uz,
    meta_keywords_ru,
    meta_keywords_uz,
    canonical_url,
    og_title_ru,
    og_title_uz,
    og_description_ru,
    og_description_uz,
    og_image,
    index: indexFlag,
    sitemap_priority,
    sitemap_changefreq,
    // простая схема: храним только categoryId
    categoryId: categoryId ?? null,
  };

  if (isNew) {
    await prisma.post.create({ data });
  } else {
    await prisma.post.update({
      where: { id: postId as number },
      data,
    });
  }

  // Revalidate public pages that depend on blog posts
  revalidatePath("/ru/blog");
  revalidatePath("/uz/blog");
  revalidatePath(`/ru/blog/${slug_ru}`);
  revalidatePath(`/uz/blog/${slug_uz}`);
  revalidatePath("/ru");
  revalidatePath("/uz");
  revalidatePath("/sitemap.xml");

  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

interface PageProps {
  params: { id: string };
}

export default async function BlogPostEditPage({ params }: PageProps) {
  const isNew = params.id === "new";
  const postId = isNew ? null : Number(params.id);

  if (!isNew && (postId === null || Number.isNaN(postId))) {
    notFound();
  }

  const [post, categories] = await Promise.all([
    isNew
      ? null
      : prisma.post.findUnique({
          where: { id: postId as number },
        }),
    prisma.category.findMany({
      orderBy: { name_ru: "asc" },
    }),
  ]);

  if (!isNew && !post) {
    notFound();
  }

  const initialPost =
    (post ?? {
      id: 0,
      slug_ru: "",
      slug_uz: "",
      title_ru: "",
      title_uz: "",
      excerpt_ru: "",
      excerpt_uz: "",
      content_ru: "",
      content_uz: "",
      tags: "",
      published_at: null,
      is_published: false,
      categoryId: null,
      meta_title_ru: "",
      meta_title_uz: "",
      meta_description_ru: "",
      meta_description_uz: "",
      meta_keywords_ru: "",
      meta_keywords_uz: "",
      canonical_url: "",
      og_title_ru: "",
      og_title_uz: "",
      og_description_ru: "",
      og_description_uz: "",
      og_image: "",
      index: true,
      sitemap_priority: 0.7,
      sitemap_changefreq: "weekly",
    }) as any;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {isNew
              ? "Новая статья блога"
              : `Редактирование статьи: ${
                  initialPost.title_ru ||
                  initialPost.title_uz ||
                  initialPost.slug_ru
                }`}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Блог — это основа SEO. Каждый материал должен бить по
            конкретным запросам и подогревать доверие к Possible Group.
          </p>
        </div>
        <a
          href="/admin/blog"
          className="text-xs text-neutral-400 hover:text-neutral-100"
        >
          ← Назад к списку статей
        </a>
      </header>

      <form action={savePost} className="space-y-6">
        {/* hidden id */}
        <input
          type="hidden"
          name="id"
          value={isNew ? "" : initialPost.id}
        />

        {/* SLUG + ОСНОВА */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Базовая информация
          </h2>

          <div className="grid gap-4 md:grid-cols-2 text-xs">
            <div className="space-y-1">
              <label className="text-neutral-300">Slug (RU)</label>
              <input
                type="text"
                name="slug_ru"
                defaultValue={initialPost.slug_ru}
                placeholder="avtomatizaciya-riteyla"
                className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-emerald-400"
              />
              <p className="text-[11px] text-neutral-500">
                URL: <code>/ru/blog/slug</code>
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-neutral-300">Slug (UZ)</label>
              <input
                type="text"
                name="slug_uz"
                defaultValue={initialPost.slug_uz}
                placeholder="biznes-avtomatlashtirish"
                className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-emerald-400"
              />
              <p className="text-[11px] text-neutral-500">
                URL: <code>/uz/blog/slug</code>
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-neutral-300">
                Заголовок (RU) — H1
              </label>
              <input
                type="text"
                name="title_ru"
                defaultValue={initialPost.title_ru}
                placeholder="Как автоматизировать сеть магазинов и не сойти с ума"
                className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-neutral-300">
                Sarlavha (UZ) — H1
              </label>
              <input
                type="text"
                name="title_uz"
                defaultValue={initialPost.title_uz}
                placeholder="Do‘kon tarmog‘ini qanday avtomatlashtirish mumkin"
                className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300">
                Краткий excerpt (RU)
              </label>
              <textarea
                name="excerpt_ru"
                rows={3}
                defaultValue={initialPost.excerpt_ru}
                placeholder="2–3 предложения, которые появятся в списке статей и в превью."
                className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300">
                Qisqacha excerpt (UZ)
              </label>
              <textarea
                name="excerpt_uz"
                rows={3}
                defaultValue={initialPost.excerpt_uz}
                placeholder="Ro‘yxat va prevyuda ko‘rinadigan qisqa tavsif."
                className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-neutral-300">
                Категория (для фильтрации и структуры)
              </label>
              <select
                name="categoryId"
                defaultValue={initialPost.categoryId ?? ""}
                className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-emerald-400"
              >
                <option value="">Без категории</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_ru}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-neutral-500">
                Категории помогают группировать материалы: “Автоматизация
                ритейла”, “CRM”, “Интеграции” и т.д.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300">
                Теги (через запятую)
              </label>
              <input
                type="text"
                name="tags"
                defaultValue={initialPost.tags ?? ""}
                placeholder="автоматизация, crm, erp, retail"
                className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300">Публикация</label>
              <div className="flex items-center gap-3">
                <input
                  id="is_published"
                  type="checkbox"
                  name="is_published"
                  defaultChecked={initialPost.is_published}
                  className="h-4 w-4 rounded border-emerald-400 bg-transparent"
                />
                <label
                  htmlFor="is_published"
                  className="text-xs text-neutral-300"
                >
                  Опубликована
                </label>
              </div>
              <div className="mt-2 space-y-1">
                <label className="text-neutral-300 text-xs">
                  Дата публикации (опционально)
                </label>
                <input
                  type="datetime-local"
                  name="published_at"
                  defaultValue={
                    initialPost.published_at
                      ? new Date(initialPost.published_at)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* КОНТЕНТ RU / UZ */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Контент статьи (RU / UZ)
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-xs">
            <div className="space-y-2">
              <label className="text-neutral-300">Контент (RU)</label>
              <textarea
                name="content_ru"
                rows={14}
                defaultValue={initialPost.content_ru}
                placeholder="Основной текст статьи на русском. Можно использовать разметку Markdown."
                className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-neutral-300">Kontent (UZ)</label>
              <textarea
                name="content_uz"
                rows={14}
                defaultValue={initialPost.content_uz}
                placeholder="Asosiy maqola matni (UZ). Markdown ham ishlatishingiz mumkin."
                className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        </section>

        {/* SEO */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">SEO-поля</h2>

          <div className="grid gap-4 md:grid-cols-2 text-xs">
            <div>
              <label className="text-neutral-300">Meta title (RU)</label>
              <input
                type="text"
                name="meta_title_ru"
                defaultValue={initialPost.meta_title_ru ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-neutral-300">Meta title (UZ)</label>
              <input
                type="text"
                name="meta_title_uz"
                defaultValue={initialPost.meta_title_uz ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300">
                Meta description (RU)
              </label>
              <textarea
                name="meta_description_ru"
                rows={3}
                defaultValue={initialPost.meta_description_ru ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-neutral-300">
                Meta description (UZ)
              </label>
              <textarea
                name="meta_description_uz"
                rows={3}
                defaultValue={initialPost.meta_description_uz ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300">
                Meta keywords (RU)
              </label>
              <input
                type="text"
                name="meta_keywords_ru"
                defaultValue={initialPost.meta_keywords_ru ?? ""}
                placeholder="автоматизация, crm, erp, possible group"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-neutral-300">
                Meta keywords (UZ)
              </label>
              <input
                type="text"
                name="meta_keywords_uz"
                defaultValue={initialPost.meta_keywords_uz ?? ""}
                placeholder="avtomatlashtirish, crm, erp, possible group"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300">Canonical URL</label>
              <input
                type="text"
                name="canonical_url"
                defaultValue={initialPost.canonical_url ?? ""}
                placeholder="https://possible.uz/ru/blog/..."
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300 block mb-1">
                Обложка / OG image
              </label>
              <ImageUploadField
                name="og_image"
                label="Загрузить изображение для статьи"
                defaultValue={initialPost.og_image ?? ""}
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Картинка будет использоваться как обложка статьи и OG-image для соцсетей.
              </p>
            </div>

            <div>
              <label className="text-neutral-300">OG title (RU)</label>
              <input
                type="text"
                name="og_title_ru"
                defaultValue={initialPost.og_title_ru ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-neutral-300">OG title (UZ)</label>
              <input
                type="text"
                name="og_title_uz"
                defaultValue={initialPost.og_title_uz ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300">
                OG description (RU)
              </label>
              <textarea
                name="og_description_ru"
                rows={3}
                defaultValue={initialPost.og_description_ru ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-neutral-300">
                OG description (UZ)
              </label>
              <textarea
                name="og_description_uz"
                rows={3}
                defaultValue={initialPost.og_description_uz ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 border-t border-white/5 pt-4 text-xs md:grid-cols-3">
            <div className="flex items-center gap-2">
              <input
                id="index"
                type="checkbox"
                name="index"
                defaultChecked={initialPost.index}
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-800"
              />
              <label htmlFor="index" className="text-neutral-300">
                Разрешить индексацию (index)
              </label>
            </div>
            <div>
              <label className="text-neutral-300">
                Sitemap priority
              </label>
              <input
                type="number"
                name="sitemap_priority"
                min={0.1}
                max={1}
                step={0.1}
                defaultValue={initialPost.sitemap_priority?.toString() ?? "0.7"}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-neutral-300">Changefreq</label>
              <select
                name="sitemap_changefreq"
                defaultValue={initialPost.sitemap_changefreq ?? "weekly"}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
              </select>
            </div>
          </div>
        </section>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-black shadow-md shadow-emerald-500/30 hover:bg-emerald-400"
          >
            {isNew ? "Создать статью" : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}
