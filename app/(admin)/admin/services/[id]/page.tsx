// app/(admin)/admin/services/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

async function getService(id: string) {
  if (id === "new") return null;

  try {
    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
    });
    return service;
  } catch {
    return null;
  }
}

// SERVER ACTION: сохранить услугу
async function saveService(formData: FormData) {
  "use server";

  const id = formData.get("id")?.toString();
  const slug_ru = formData.get("slug_ru")?.toString() || "";
  const slug_uz = formData.get("slug_uz")?.toString() || "";
  const title_ru = formData.get("title_ru")?.toString() || "";
  const title_uz = formData.get("title_uz")?.toString() || "";
  const short_description_ru =
    formData.get("short_description_ru")?.toString() || "";
  const short_description_uz =
    formData.get("short_description_uz")?.toString() || "";
  const content_ru = formData.get("content_ru")?.toString() || "";
  const content_uz = formData.get("content_uz")?.toString() || "";
  const problem_ru = formData.get("problem_ru")?.toString() || "";
  const problem_uz = formData.get("problem_uz")?.toString() || "";
  const solution_ru = formData.get("solution_ru")?.toString() || "";
  const solution_uz = formData.get("solution_uz")?.toString() || "";
  const result_ru = formData.get("result_ru")?.toString() || "";
  const result_uz = formData.get("result_uz")?.toString() || "";
  const fit_ru = formData.get("fit_ru")?.toString() || "";
  const fit_uz = formData.get("fit_uz")?.toString() || "";

  const icon = formData.get("icon")?.toString() || "";

  const meta_keywords_ru =
    formData.get("meta_keywords_ru")?.toString() || "";
  const meta_keywords_uz =
    formData.get("meta_keywords_uz")?.toString() || "";

  const canonical_url = formData.get("canonical_url")?.toString() || "";

  const meta_title_ru = formData.get("meta_title_ru")?.toString() || "";
  const meta_title_uz = formData.get("meta_title_uz")?.toString() || "";
  const meta_description_ru =
    formData.get("meta_description_ru")?.toString() || "";
  const meta_description_uz =
    formData.get("meta_description_uz")?.toString() || "";

  const og_title_ru = formData.get("og_title_ru")?.toString() || "";
  const og_title_uz = formData.get("og_title_uz")?.toString() || "";
  const og_description_ru =
    formData.get("og_description_ru")?.toString() || "";
  const og_description_uz =
    formData.get("og_description_uz")?.toString() || "";

  const og_image = formData.get("og_image")?.toString() || "";

  const indexing = formData.get("indexing") === "on";
  const sitemap_priority = Number(
    formData.get("sitemap_priority")?.toString() || "0.7",
  );
  const sitemap_changefreq =
    formData.get("sitemap_changefreq")?.toString() || "weekly";

  if (!title_ru || !slug_ru) {
    throw new Error("Не заполнены обязательные поля: title_ru или slug_ru");
  }

  const data = {
    slug_ru,
    slug_uz,
    title_ru,
    title_uz,
    short_description_ru,
    short_description_uz,
    content_ru,
    content_uz,
    problem_ru,
    problem_uz,
    solution_ru,
    solution_uz,
    result_ru,
    result_uz,
    fit_ru,
    fit_uz,
    icon,
    meta_keywords_ru,
    meta_keywords_uz,
    canonical_url,
    meta_title_ru,
    meta_title_uz,
    meta_description_ru,
    meta_description_uz,
    og_title_ru,
    og_title_uz,
    og_description_ru,
    og_description_uz,
    og_image,
    index: indexing,
    sitemap_priority,
    sitemap_changefreq,
  };

  if (id && id !== "new") {
    await prisma.service.update({
      where: { id: Number(id) },
      data,
    });
  } else {
    await prisma.service.create({ data });
  }

  // Revalidate public pages that depend on services
  revalidatePath("/ru/services");
  revalidatePath("/uz/services");
  revalidatePath(`/ru/services/${slug_ru}`);
  revalidatePath(`/uz/services/${slug_uz}`);
  revalidatePath("/ru");
  revalidatePath("/uz");
  revalidatePath("/sitemap.xml");

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export default async function ServiceEditPage({
  params,
}: {
  params: { id: string };
}) {
  const service = await getService(params.id);
  const isNew = !service;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {isNew
              ? "Новая услуга"
              : `Услуга: ${service.title_ru || service.title_uz}`}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Заполни контент на двух языках и SEO-поля, чтобы страница услуги
            хорошо ранжировалась по целевым запросам.
          </p>
        </div>
      </header>

      {/* Форма */}
      <form action={saveService} className="space-y-6">
        <input type="hidden" name="id" defaultValue={service?.id ?? "new"} />

        {/* Slug + базовая информация */}
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
                defaultValue={service?.slug_ru ?? ""}
                placeholder="avtomatizaciya-biznesa"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-neutral-500">
                URL: <code>/ru/services/slug</code>
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-neutral-300">Slug (UZ)</label>
              <input
                type="text"
                name="slug_uz"
                defaultValue={service?.slug_uz ?? ""}
                placeholder="biznes-avtomatizatsiya"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-neutral-500">
                URL: <code>/uz/xizmatlar/slug</code>
              </p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-neutral-300">
                Иконка / emoji услуги (icon)
              </label>
              <input
                type="text"
                name="icon"
                defaultValue={service?.icon ?? ""}
                placeholder="например: 💻 или /icons/retail.svg"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-neutral-500">
                Используется для бейджа услуги на списках / карточках. Поле
                необязательное.
              </p>
            </div>
          </div>
        </section>

        {/* Контент RU / UZ */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Контент услуги (RU / UZ)
          </h2>

          <div className="grid gap-4 md:grid-cols-2 text-xs">
            {/* RU */}
            <div className="space-y-3">
              <div>
                <label className="text-neutral-300">Заголовок (RU)</label>
                <input
                  type="text"
                  name="title_ru"
                  defaultValue={service?.title_ru ?? ""}
                  placeholder="Автоматизация ритейла под ключ"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-neutral-300">
                  Краткое описание (RU)
                </label>
                <textarea
                  name="short_description_ru"
                  defaultValue={service?.short_description_ru ?? ""}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-neutral-300">Текст услуги (RU)</label>
                <textarea
                  name="content_ru"
                  defaultValue={service?.content_ru ?? ""}
                  rows={8}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  Боли клиента, решение, этапы внедрения, результаты.
                </p>
              </div>
            </div>

            {/* UZ */}
            <div className="space-y-3">
              <div>
                <label className="text-neutral-300">Sarlavha (UZ)</label>
                <input
                  type="text"
                  name="title_uz"
                  defaultValue={service?.title_uz ?? ""}
                  placeholder="Retail uchun to‘liq avtomatlashtirish"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-neutral-300">Qisqacha tavsif (UZ)</label>
                <textarea
                  name="short_description_uz"
                  defaultValue={service?.short_description_uz ?? ""}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-neutral-300">Xizmat matni (UZ)</label>
                <textarea
                  name="content_uz"
                  defaultValue={service?.content_uz ?? ""}
                  rows={8}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Проблема / решение / результат + кому подходит (RU / UZ) */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Проблема / решение / результат + кому подходит (RU / UZ)
          </h2>

          <div className="grid gap-4 md:grid-cols-2 text-xs">
            {/* RU */}
            <div className="space-y-3">
              <div>
                <label className="text-neutral-300">Проблема (RU)</label>
                <textarea
                  name="problem_ru"
                  defaultValue={service?.problem_ru ?? ""}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  placeholder="Ручной учёт, разрозненные системы, владелец не видит картину по сети."
                />
              </div>

              <div>
                <label className="text-neutral-300">Решение (RU)</label>
                <textarea
                  name="solution_ru"
                  defaultValue={service?.solution_ru ?? ""}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  placeholder="Единый контур: касса, склад, CRM, онлайн-оплата, доставка, аналитика…"
                />
              </div>

              <div>
                <label className="text-neutral-300">Результат (RU)</label>
                <textarea
                  name="result_ru"
                  defaultValue={service?.result_ru ?? ""}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  placeholder="Прозрачные цифры, меньше ручных операций, готовность масштабировать сеть."
                />
              </div>

              <div>
                <label className="text-neutral-300">
                  Кому подойдёт эта услуга (RU)
                </label>
                <textarea
                  name="fit_ru"
                  defaultValue={service?.fit_ru ?? ""}
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  placeholder="Магазины и сети, кафе, dark-kitchen, владельцы, которые хотят видеть цифры и навести порядок в учёте."
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  Опиши типы бизнеса и ситуации, для кого эта услуга идеальна.
                </p>
              </div>
            </div>

            {/* UZ */}
            <div className="space-y-3">
              <div>
                <label className="text-neutral-300">Muammo (UZ)</label>
                <textarea
                  name="problem_uz"
                  defaultValue={service?.problem_uz ?? ""}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  placeholder="Qo‘l bilan yuritiladigan hisob, bo‘lingan tizimlar, egasi tarmoqqa umumiy qaray olmaydi."
                />
              </div>

              <div>
                <label className="text-neutral-300">Yechim (UZ)</label>
                <textarea
                  name="solution_uz"
                  defaultValue={service?.solution_uz ?? ""}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  placeholder="Yagona kontur: kassa, ombor, CRM, online to‘lov, yetkazib berish va analitika bitta tizimda."
                />
              </div>

              <div>
                <label className="text-neutral-300">Natija (UZ)</label>
                <textarea
                  name="result_uz"
                  defaultValue={service?.result_uz ?? ""}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  placeholder="Aniq raqamlar, kamroq qo‘l mehnati, tarmoqni kengaytirishga tayyor tizim."
                />
              </div>

              <div>
                <label className="text-neutral-300">
                  Kimlar uchun qulay (UZ)
                </label>
                <textarea
                  name="fit_uz"
                  defaultValue={service?.fit_uz ?? ""}
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  placeholder="Do‘kon tarmoqlari, umumiy ovqatlanish, dark-kitchen va hokazo."
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  Masalan: do‘kon tarmoqlari, umumiy ovqatlanish, dark-kitchen va hokazo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO-поля + картинка */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">SEO-поля</h2>

          {/* Meta RU / UZ */}
          <div className="grid gap-4 md:grid-cols-2 text-xs">
            {/* RU */}
            <div className="space-y-3">
              <div>
                <label className="text-neutral-300">Meta title (RU)</label>
                <input
                  type="text"
                  name="meta_title_ru"
                  defaultValue={service?.meta_title_ru ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-neutral-300">
                  Meta description (RU)
                </label>
                <textarea
                  name="meta_description_ru"
                  defaultValue={service?.meta_description_ru ?? ""}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-neutral-300">OG title (RU)</label>
                <input
                  type="text"
                  name="og_title_ru"
                  defaultValue={service?.og_title_ru ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-neutral-300">
                  OG description (RU)
                </label>
                <textarea
                  name="og_description_ru"
                  defaultValue={service?.og_description_ru ?? ""}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* UZ */}
            <div className="space-y-3">
              <div>
                <label className="text-neutral-300">Meta title (UZ)</label>
                <input
                  type="text"
                  name="meta_title_uz"
                  defaultValue={service?.meta_title_uz ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-neutral-300">
                  Meta description (UZ)
                </label>
                <textarea
                  name="meta_description_uz"
                  defaultValue={service?.meta_description_uz ?? ""}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-neutral-300">OG title (UZ)</label>
                <input
                  type="text"
                  name="og_title_uz"
                  defaultValue={service?.og_title_uz ?? ""}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-neutral-300">
                  OG description (UZ)
                </label>
                <textarea
                  name="og_description_uz"
                  defaultValue={service?.og_description_uz ?? ""}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Дополнительные SEO-поля: keywords и canonical */}
          <div className="mt-2 grid gap-4 md:grid-cols-3 text-xs">
            <div className="space-y-1 md:col-span-2">
              <label className="text-neutral-300">
                Meta keywords (RU, через запятую)
              </label>
              <input
                type="text"
                name="meta_keywords_ru"
                defaultValue={service?.meta_keywords_ru ?? ""}
                placeholder="автоматизация бизнеса, crm для ритейла, erp для общепита"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
              <label className="mt-2 block text-neutral-300">
                Meta keywords (UZ, vergul bilan)
              </label>
              <input
                type="text"
                name="meta_keywords_uz"
                defaultValue={service?.meta_keywords_uz ?? ""}
                placeholder="biznes avtomatlashtirish, retail crm, umumiy ovqatlanish erp"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Сейчас поисковики почти не учитывают keywords, но для
                внутренней структуры и экспорта это поле может быть полезно.
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-neutral-300">Canonical URL</label>
              <input
                type="text"
                name="canonical_url"
                defaultValue={service?.canonical_url ?? ""}
                placeholder="https://possible.uz/ru/services/avtomatizaciya-biznesa"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Заполняй, если нужно указать канонический адрес, отличный от
                текущего URL. Иначе можно оставить пустым.
              </p>
            </div>
          </div>

          {/* OG image + индексация / sitemap */}
          <div className="grid gap-4 md:grid-cols-3 text-xs pt-2">
            <div>
              <ImageUploadField
                name="og_image"
                label="OG image (картинка для превью / соцсетей)"
                defaultValue={service?.og_image ?? ""}
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Файл сохранится в <code>/public/uploads</code> и будет
                использоваться в Open Graph.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                name="indexing"
                defaultChecked={service?.index ?? true}
                className="h-4 w-4 rounded border border-white/20 bg-black"
              />
              <span className="text-neutral-200">
                Разрешить индексацию (index)
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-neutral-300">Sitemap priority</label>
                <input
                  type="number"
                  min="0.1"
                  max="1"
                  step="0.1"
                  name="sitemap_priority"
                  defaultValue={service?.sitemap_priority ?? 0.7}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-neutral-300">Changefreq</label>
                <input
                  type="text"
                  name="sitemap_changefreq"
                  defaultValue={service?.sitemap_changefreq ?? "weekly"}
                  placeholder="daily / weekly / monthly"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Кнопки */}
        <div className="flex items-center justify-between">
          <a
            href="/admin/services"
            className="text-xs text-neutral-400 hover:text-neutral-200"
          >
            ← Назад к списку услуг
          </a>
          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black shadow hover:bg-neutral-100"
          >
            {isNew ? "Создать услугу" : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}
