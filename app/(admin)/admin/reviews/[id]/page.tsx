import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function ReviewEditPage({ params }: Props) {
  const isNew = params.id === "new";
  const reviewId = isNew ? null : Number(params.id);

  if (!isNew && (reviewId === null || isNaN(reviewId))) {
    notFound();
  }

  const review = isNew
    ? null
    : await prisma.review.findUnique({
        where: { id: reviewId as number },
      });

  if (!isNew && !review) {
    notFound();
  }

  const initialReview =
    review ??
    ({
      id: 0,
      client_name: "",
      position: "",
      company: "",
      text_ru: "",
      text_uz: "",
      rating: 5,
      avatar: "",
      is_featured: false,
    } as any);

  // SERVER ACTION
  async function saveReview(formData: FormData) {
    "use server";

    const idRaw = formData.get("id")?.toString();
    const isNew = !idRaw;
    const reviewId = idRaw ? Number(idRaw) : null;

    const client_name = formData.get("client_name")?.toString() || "";
    const position = formData.get("position")?.toString() || "";
    const company = formData.get("company")?.toString() || "";
    const text_ru = formData.get("text_ru")?.toString() || "";
    const text_uz = formData.get("text_uz")?.toString() || "";
    const ratingRaw = formData.get("rating")?.toString() || "5";
    const avatar = formData.get("avatar")?.toString() || "";
    const is_featured = formData.get("is_featured") === "on";

    if (!client_name || !text_ru || !text_uz) {
      throw new Error("Не заполнены обязательные поля (имя клиента, текст RU и UZ).");
    }

    let rating = Number(ratingRaw);
    if (isNaN(rating)) rating = 5;
    if (rating < 1) rating = 1;
    if (rating > 5) rating = 5;

    const data = {
      client_name,
      position: position || null,
      company: company || null,
      text_ru,
      text_uz,
      rating,
      avatar: avatar || null,
      is_featured,
    };

    if (isNew) {
      await prisma.review.create({ data });
    } else {
      await prisma.review.update({
        where: { id: reviewId as number },
        data,
      });
    }

    revalidatePath("/admin/reviews");
    redirect("/admin/reviews");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {isNew
              ? "Новый отзыв"
              : `Отзыв: ${initialReview.client_name || "Без имени"}`}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Сильные, живые отзывы — это социальное доказательство для владельцев
            бизнеса. Добавь короткий, честный текст на двух языках, рейтинг и,
            при желании, аватар клиента.
          </p>
        </div>
      </header>

      <form action={saveReview} className="space-y-6">
        {/* скрытый id */}
        <input
          type="hidden"
          name="id"
          value={isNew ? "" : initialReview.id}
        />

        {/* Основные данные клиента */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Клиент и базовая информация
          </h2>

          <div className="grid gap-4 md:grid-cols-3 text-xs">
            <div className="space-y-1 md:col-span-1">
              <label className="text-neutral-300">Имя клиента</label>
              <input
                type="text"
                name="client_name"
                defaultValue={initialReview.client_name}
                placeholder="Иван Иванов, Azizbek va hokazo"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300">Должность</label>
              <input
                type="text"
                name="position"
                defaultValue={initialReview.position || ""}
                placeholder="Основатель, Директор, Co-founder..."
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300">Компания</label>
              <input
                type="text"
                name="company"
                defaultValue={initialReview.company || ""}
                placeholder="Possible Group, Rolling Sushi..."
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 text-xs pt-2">
            <div className="space-y-1">
              <label className="text-neutral-300">Рейтинг (1–5)</label>
              <input
                type="number"
                name="rating"
                min={1}
                max={5}
                defaultValue={initialReview.rating ?? 5}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-emerald-400"
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                5 — максимально сильный отзыв.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_featured"
                type="checkbox"
                name="is_featured"
                defaultChecked={initialReview.is_featured}
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-800"
              />
              <label
                htmlFor="is_featured"
                className="text-xs text-neutral-300"
              >
                Показать на главной (featured)
              </label>
            </div>
          </div>
        </section>

        {/* Текст отзыва RU / UZ */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Текст отзыва (RU / UZ)
          </h2>

          <div className="grid gap-4 md:grid-cols-2 text-xs">
            <div className="space-y-2">
              <label className="text-neutral-300">Отзыв (RU)</label>
              <textarea
                name="text_ru"
                rows={6}
                defaultValue={initialReview.text_ru}
                placeholder="Коротко и по делу: что было, что сделали Possible Group и какой результат."
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-emerald-400"
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Можно 2–4 предложения, без воды.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-neutral-300">Fikr (UZ)</label>
              <textarea
                name="text_uz"
                rows={6}
                defaultValue={initialReview.text_uz}
                placeholder="Qisqa, lekin mazmunli — Possible Group bilan ish natijasi haqida."
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        </section>

        {/* Аватар / фото клиента */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Мини‑фото: аватар или логотип клиента
          </h2>

          <div className="grid gap-6 md:grid-cols-[2fr,1.2fr] text-xs">
            <div className="space-y-3">
              <ImageUploadField
                name="avatar"
                label="Загрузить фото (аватар клиента)"
                defaultValue={initialReview.avatar ?? ""}
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Небольшое квадратное фото (аватар человека или логотип компании) ~400×400. Файл сохраняется в{" "}
                <code>/public/uploads</code>.
              </p>
            </div>

            {initialReview.avatar && (
              <div className="space-y-2">
                <p className="text-[11px] text-neutral-400">
                  Текущий аватар:
                </p>
                <div className="relative h-32 w-32 overflow-hidden rounded-full border border-white/10 bg-neutral-900">
                  <Image
                    src={initialReview.avatar}
                    alt={initialReview.client_name || "Avatar"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SEO ДАННЫЕ */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">SEO (RU / UZ)</h2>

          <div className="grid gap-4 md:grid-cols-2 text-xs">
            <div className="space-y-2">
              <label className="text-neutral-300">Meta title (RU)</label>
              <input
                type="text"
                name="meta_title_ru"
                defaultValue={initialReview.meta_title_ru ?? ""}
                placeholder="Отзыв клиента Possible Group"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />

              <label className="mt-3 block text-neutral-300">Meta description (RU)</label>
              <textarea
                name="meta_description_ru"
                rows={3}
                defaultValue={initialReview.meta_description_ru ?? ""}
                placeholder="Краткое описание отзыва для поисковиков"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-neutral-300">Meta title (UZ)</label>
              <input
                type="text"
                name="meta_title_uz"
                defaultValue={initialReview.meta_title_uz ?? ""}
                placeholder="Mijoz fikri — Possible Group"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />

              <label className="mt-3 block text-neutral-300">Meta description (UZ)</label>
              <textarea
                name="meta_description_uz"
                rows={3}
                defaultValue={initialReview.meta_description_uz ?? ""}
                placeholder="SEO uchun qisqa tavsif"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 text-xs pt-3">
            <div className="space-y-2 md:col-span-2">
              <label className="text-neutral-300">Meta keywords (RU)</label>
              <input
                type="text"
                name="meta_keywords_ru"
                defaultValue={initialReview.meta_keywords_ru ?? ""}
                placeholder="отзыв, Possible Group, автоматизация"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />

              <label className="mt-3 block text-neutral-300">Meta keywords (UZ)</label>
              <input
                type="text"
                name="meta_keywords_uz"
                defaultValue={initialReview.meta_keywords_uz ?? ""}
                placeholder="mijoz fikri, avtomatlashtirish, Possible Group"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-neutral-300">Canonical URL</label>
              <input
                type="text"
                name="canonical_url"
                defaultValue={initialReview.canonical_url ?? ""}
                placeholder="https://possible.uz/..."
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 text-xs pt-4 border-t border-white/10">
            <div className="space-y-2">
              <label className="text-neutral-300">OG title (RU)</label>
              <input
                type="text"
                name="og_title_ru"
                defaultValue={initialReview.og_title_ru ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />

              <label className="mt-3 block text-neutral-300">OG description (RU)</label>
              <textarea
                name="og_description_ru"
                rows={2}
                defaultValue={initialReview.og_description_ru ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-neutral-300">OG title (UZ)</label>
              <input
                type="text"
                name="og_title_uz"
                defaultValue={initialReview.og_title_uz ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />

              <label className="mt-3 block text-neutral-300">OG description (UZ)</label>
              <textarea
                name="og_description_uz"
                rows={2}
                defaultValue={initialReview.og_description_uz ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 text-xs pt-4">
            <div className="space-y-2">
              <label className="text-neutral-300">OG image (URL)</label>
              <input
                type="text"
                name="og_image"
                defaultValue={initialReview.og_image ?? ""}
                placeholder="https://..."
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="index"
                type="checkbox"
                name="index"
                defaultChecked={initialReview.index ?? true}
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-800"
              />
              <label htmlFor="index" className="text-xs text-neutral-300">
                Разрешить индексацию
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-neutral-300">Sitemap priority</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                name="sitemap_priority"
                defaultValue={initialReview.sitemap_priority?.toString() ?? "0.4"}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none"
              />

              <label className="text-neutral-300">Changefreq</label>
              <select
                name="sitemap_changefreq"
                defaultValue={initialReview.sitemap_changefreq ?? "monthly"}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-2 py-2 text-white outline-none"
              >
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
              </select>
            </div>
          </div>
        </section>

        {/* Кнопки */}
        <div className="flex items-center justify-between">
          <a
            href="/admin/reviews"
            className="text-xs text-neutral-400 hover:text-neutral-200"
          >
            ← Назад к списку отзывов
          </a>
          <button
            type="submit"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-black shadow hover:bg-emerald-400"
          >
            {isNew ? "Создать отзыв" : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}
