import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function CaseEditPage({ params }: Props) {
  const isNew = params.id === "new";
  const caseId = isNew ? null : Number(params.id);

  if (!isNew && (caseId === null || isNaN(caseId))) notFound();

  const caseItem = isNew
    ? null
    : await prisma.case.findUnique({
        where: { id: caseId as number },
        include: {
          service: true,
        },
      });

  const services = await prisma.service.findMany({
    orderBy: { title_ru: "asc" },
  });

  if (!isNew && !caseItem) notFound();

  const initialCase = (caseItem ?? {
    id: 0,
    client_name: "",
    industry: "",
    slug_ru: "",
    slug_uz: "",
    title_ru: "",
    title_uz: "",
    description_ru: "",
    description_uz: "",
    problem_ru: "",
    problem_uz: "",
    solution_ru: "",
    solution_uz: "",
    result_ru: "",
    result_uz: "",
    launch_date: null,
    serviceId: null,
    screenshots: "",
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
    sitemap_priority: 0.6,
    sitemap_changefreq: "monthly",
  }) as any;

  // SERVER ACTION
  async function saveCase(formData: FormData) {
    "use server";

    // читаем id из формы
    const idRaw = formData.get("id")?.toString();
    const isNew = !idRaw;
    const caseId = idRaw ? Number(idRaw) : null;

    const client_name = formData.get("client_name")?.toString() || "";
    const industry = formData.get("industry")?.toString() || "";

    const slug_ru = formData.get("slug_ru")?.toString() || "";
    const slug_uz = formData.get("slug_uz")?.toString() || "";

    const title_ru = formData.get("title_ru")?.toString() || "";
    const title_uz = formData.get("title_uz")?.toString() || "";

    const description_ru = formData.get("description_ru")?.toString() || "";
    const description_uz = formData.get("description_uz")?.toString() || "";

    const problem_ru = formData.get("problem_ru")?.toString() || "";
    const problem_uz = formData.get("problem_uz")?.toString() || "";

    const solution_ru = formData.get("solution_ru")?.toString() || "";
    const solution_uz = formData.get("solution_uz")?.toString() || "";

    const result_ru = formData.get("result_ru")?.toString() || "";
    const result_uz = formData.get("result_uz")?.toString() || "";

    const launch_date_raw = formData.get("launch_date")?.toString() || "";
    const launch_date = launch_date_raw ? new Date(launch_date_raw) : null;

    const serviceId_raw = formData.get("serviceId")?.toString();
    const serviceId = serviceId_raw ? Number(serviceId_raw) : null;

    const screenshots = formData.get("screenshots")?.toString() || null;

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

    const indexFlag = formData.get("index")?.toString() === "on";
    const sitemap_priority = Number(
      formData.get("sitemap_priority")?.toString() || 0.6
    );
    const sitemap_changefreq =
      formData.get("sitemap_changefreq")?.toString() || "monthly";

  const data = {
      client_name,
      industry,
      slug_ru,
      slug_uz,
      title_ru,
      title_uz,
      description_ru,
      description_uz,
      problem_ru,
      problem_uz,
      solution_ru,
      solution_uz,
      result_ru,
      result_uz,
      launch_date,
      serviceId: serviceId ?? undefined,
      screenshots,
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
    };

    const saved = isNew
      ? await prisma.case.create({ data })
      : await prisma.case.update({
          where: { id: caseId as number },
          data,
        });

    // Revalidate public pages that depend on cases
    revalidatePath("/ru/cases");
    revalidatePath("/uz/cases");
    if (saved.slug_ru) {
      revalidatePath(`/ru/cases/${saved.slug_ru}`);
    }
    if (saved.slug_uz) {
      revalidatePath(`/uz/cases/${saved.slug_uz}`);
    }
    revalidatePath("/ru");
    revalidatePath("/uz");
    revalidatePath("/sitemap.xml");

    revalidatePath("/admin/cases");
    redirect("/admin/cases");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {isNew
              ? "Новый кейс"
              : `Кейс: ${
                  initialCase.title_ru ||
                  initialCase.title_uz ||
                  initialCase.client_name
                }`}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Опиши реальный проект: клиент, индустрия, проблема, решение и
            результат. Эти кейсы будут ключевым аргументом для владельцев
            бизнеса и важным сигналом для SEO.
          </p>
        </div>
      </header>

      <form action={saveCase} className="space-y-6">
        {/* скрытый id, чтобы обновление работало стабильно */}
        <input
          type="hidden"
          name="id"
          value={isNew ? "" : initialCase.id}
        />

        {/* Клиент / индустрия / базовая инфа */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Клиент и базовая информация
          </h2>

          <div className="grid gap-4 md:grid-cols-2 text-xs">
            <div className="space-y-1">
              <label className="text-neutral-300">Клиент</label>
              <input
                type="text"
                name="client_name"
                defaultValue={initialCase.client_name}
                placeholder="Rolling Sushi, Passwall Group и т.д."
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300">Индустрия</label>
              <input
                type="text"
                name="industry"
                defaultValue={initialCase.industry}
                placeholder="ритейл, ресторан, e-commerce, дистрибуция..."
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300">Slug (RU)</label>
              <input
                type="text"
                name="slug_ru"
                defaultValue={initialCase.slug_ru}
                placeholder="rolling-sushi-avtomatizaciya"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-neutral-500">
                URL: <code>/ru/cases/slug</code>
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300">Slug (UZ)</label>
              <input
                type="text"
                name="slug_uz"
                defaultValue={initialCase.slug_uz}
                placeholder="rolling-sushi-avtomatlashtirish"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-neutral-500">
                URL: <code>/uz/cases/slug</code>
              </p>
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-neutral-300">Заголовок кейса (RU)</label>
            <input
              type="text"
              name="title_ru"
              defaultValue={initialCase.title_ru}
              placeholder="Автоматизация сети Rolling Sushi за 30 дней"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
            <p className="text-[11px] text-neutral-500">
              Этот заголовок будет использоваться на странице кейса и в списках
              кейсов (RU).
            </p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-neutral-300">Sarlavha (UZ)</label>
            <input
              type="text"
              name="title_uz"
              defaultValue={initialCase.title_uz}
              placeholder="Rolling Sushi tarmog‘ini 30 kunda avtomatlashtirish"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
            <p className="text-[11px] text-neutral-500">
              Bu sarlavha case sahifasida va case ro‘yxatlarida (UZ) ko‘rinadi.
            </p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-neutral-300">Описание кейса (RU)</label>
            <textarea
              name="description_ru"
              rows={3}
              defaultValue={initialCase.description_ru}
              placeholder="Краткое описание кейса: что за проект, что сделали, какой результат."
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-neutral-300">Tavsif (UZ)</label>
            <textarea
              name="description_uz"
              rows={3}
              defaultValue={initialCase.description_uz}
              placeholder="Case haqida qisqacha tavsif: loyiha, yechim va natija."
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </div>
        </section>

        {/* Проблема / решение / результат RU / UZ */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Проблема / Решение / Результат (RU / UZ)
          </h2>

          <div className="grid gap-4 md:grid-cols-2 text-xs">
            {/* RU */}
            <div className="space-y-3">
              <div>
                <label className="text-neutral-300">Проблема (RU)</label>
                <textarea
                  name="problem_ru"
                  rows={3}
                  defaultValue={initialCase.problem_ru}
                  placeholder="Какой хаос был до нас: ручной учёт, потери, путаница в заказах..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-neutral-300">Решение (RU)</label>
                <textarea
                  name="solution_ru"
                  rows={3}
                  defaultValue={initialCase.solution_ru}
                  placeholder="Что именно сделали: автоматизация, интеграции, дашборды, обучение команды..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-neutral-300">Результат (RU)</label>
                <textarea
                  name="result_ru"
                  rows={3}
                  defaultValue={initialCase.result_ru}
                  placeholder="Цифры и эффекты: +18% к выручке, -30% ошибок, владелец видит цифры по сети..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* UZ */}
            <div className="space-y-3">
              <div>
                <label className="text-neutral-300">Muammo (UZ)</label>
                <textarea
                  name="problem_uz"
                  rows={3}
                  defaultValue={initialCase.problem_uz}
                  placeholder="Bizdan oldin vaziyat: qo‘l bilan hisob, buyurtmalarda chalkashlik, yo‘qolayotgan mahsulotlar..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-neutral-300">Yechim (UZ)</label>
                <textarea
                  name="solution_uz"
                  rows={3}
                  defaultValue={initialCase.solution_uz}
                  placeholder="Qaysi tizimlarni joriy qildik: kassa, ombor, CRM, yetkazib berish, analitika..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-neutral-300">Natija (UZ)</label>
                <textarea
                  name="result_uz"
                  rows={3}
                  defaultValue={initialCase.result_uz}
                  placeholder="Natijalar: xatolar kamaydi, jarayonlar tezlashdi, egasi istalgan payt raqamlarni ko‘ra oladi."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Фото / услуга */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Фото / Услуга
          </h2>

          <div className="grid gap-6 md:grid-cols-2 text-xs">
            <div className="space-y-3">
              <div>
                <label className="text-neutral-300">
                  Услуга (связать с Service)
                </label>
                <select
                  name="serviceId"
                  defaultValue={initialCase.serviceId ?? ""}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                >
                  <option value="">Без привязки</option>
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.title_ru}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Привяжи кейс к конкретной услуге, чтобы на странице услуги
                  автоматически показывались связанные проекты.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <ImageUploadField
                  name="screenshots"
                  label="Загрузить фото кейса"
                  defaultValue={initialCase.screenshots ?? ""}
                />
              </div>

              {initialCase.screenshots && (
                <div>
                  <p className="mb-1 text-[11px] text-neutral-400">
                    Текущее изображение:
                  </p>
                  <div className="relative h-32 w-full overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
                    <Image
                      src={initialCase.screenshots}
                      alt={initialCase.title_ru || "Case screenshot"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SEO-поля */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">SEO-поля</h2>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-neutral-300">Meta title (RU)</label>
              <input
                type="text"
                name="meta_title_ru"
                defaultValue={initialCase.meta_title_ru ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-neutral-300">Meta title (UZ)</label>
              <input
                type="text"
                name="meta_title_uz"
                defaultValue={initialCase.meta_title_uz ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300">
                Meta description (RU)
              </label>
              <textarea
                name="meta_description_ru"
                rows={3}
                defaultValue={initialCase.meta_description_ru ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-neutral-300">
                Meta description (UZ)
              </label>
              <textarea
                name="meta_description_uz"
                rows={3}
                defaultValue={initialCase.meta_description_uz ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300">Meta keywords (RU)</label>
              <input
                type="text"
                name="meta_keywords_ru"
                defaultValue={initialCase.meta_keywords_ru ?? ""}
                placeholder="кейсы, автоматизация бизнеса, Possible Group"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300">Meta keywords (UZ)</label>
              <input
                type="text"
                name="meta_keywords_uz"
                defaultValue={initialCase.meta_keywords_uz ?? ""}
                placeholder="case, avtomatlashtirish, Possible Group"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300">Canonical URL</label>
              <input
                type="text"
                name="canonical_url"
                defaultValue={initialCase.canonical_url ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="https://possible.uz/ru/cases/..."
              />
            </div>

            <div>
              <label className="text-neutral-300">OG image (URL)</label>
              <input
                type="text"
                name="og_image"
                defaultValue={initialCase.og_image ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="https://... (картинка для соцсетей)"
              />
            </div>

            <div>
              <label className="text-neutral-300">OG title (RU)</label>
              <input
                type="text"
                name="og_title_ru"
                defaultValue={initialCase.og_title_ru ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300">OG title (UZ)</label>
              <input
                type="text"
                name="og_title_uz"
                defaultValue={initialCase.og_title_uz ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300">
                OG description (RU)
              </label>
              <textarea
                name="og_description_ru"
                rows={3}
                defaultValue={initialCase.og_description_ru ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300">
                OG description (UZ)
              </label>
              <textarea
                name="og_description_uz"
                rows={3}
                defaultValue={initialCase.og_description_uz ?? ""}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-xs pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <input
                id="index"
                type="checkbox"
                name="index"
                defaultChecked={initialCase.index}
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-800"
              />
              <label htmlFor="index" className="text-neutral-300 text-xs">
                Разрешить индексацию (index)
              </label>
            </div>

            <div>
              <label className="text-neutral-300 text-xs">
                Sitemap priority
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                name="sitemap_priority"
                defaultValue={initialCase.sitemap_priority?.toString() ?? "0.6"}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-neutral-300 text-xs">
                Changefreq
              </label>
              <select
                name="sitemap_changefreq"
                defaultValue={initialCase.sitemap_changefreq ?? "monthly"}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
          >
            Сохранить кейс
          </button>
        </div>
      </form>x
    </div>
  );
}
