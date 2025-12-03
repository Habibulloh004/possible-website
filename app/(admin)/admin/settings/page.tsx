

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

async function getSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 1 },
  });
  return settings;
}

// SERVER ACTION: сохранить настройки сайта
async function saveSettings(formData: FormData) {
  "use server";

  const company_name = formData.get("company_name")?.toString() || "";
  const phone = formData.get("phone")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const address = formData.get("address")?.toString() || "";

  const logo = formData.get("logo")?.toString() || "";
  const favicon = formData.get("favicon")?.toString() || "";

  const telegram_url = formData.get("telegram_url")?.toString() || "";
  const whatsapp_url = formData.get("whatsapp_url")?.toString() || "";
  const instagram_url = formData.get("instagram_url")?.toString() || "";
  const facebook_url = formData.get("facebook_url")?.toString() || "";
  const linkedin_url = formData.get("linkedin_url")?.toString() || "";

  const default_meta_title_ru =
    formData.get("default_meta_title_ru")?.toString() || "";
  const default_meta_title_uz =
    formData.get("default_meta_title_uz")?.toString() || "";

  const default_meta_desc_ru =
    formData.get("default_meta_desc_ru")?.toString() || "";
  const default_meta_desc_uz =
    formData.get("default_meta_desc_uz")?.toString() || "";

  const default_og_image =
    formData.get("default_og_image")?.toString() || "";

  const analytics_head = formData.get("analytics_head")?.toString() || "";
  const analytics_body = formData.get("analytics_body")?.toString() || "";

  if (!company_name) {
    throw new Error("Укажите название компании");
  }

  const data = {
    company_name,
    phone,
    email,
    address,
    logo,
    favicon,
    telegram_url,
    whatsapp_url,
    instagram_url,
    facebook_url,
    linkedin_url,
    default_meta_title_ru,
    default_meta_title_uz,
    default_meta_desc_ru,
    default_meta_desc_uz,
    default_og_image,
    analytics_head,
    analytics_body,
  };

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: {
      id: 1,
      ...data,
    },
  });

  // Перегенерируем важные страницы
  revalidatePath("/");
  revalidatePath("/ru");
  revalidatePath("/uz");
  revalidatePath("/admin/settings");

  redirect("/admin/settings?saved=1");
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: { saved?: string };
}) {
  const settings = await getSettings();
  const isSaved = searchParams?.saved === "1";

  const initial = settings ?? {
    company_name: "Possible Group",
    phone: "",
    email: "",
    address: "",
    logo: "",
    favicon: "",
    telegram_url: "",
    whatsapp_url: "",
    instagram_url: "",
    facebook_url: "",
    linkedin_url: "",
    default_meta_title_ru:
      "Possible Group — автоматизация бизнеса, CRM/ERP, сайты и боты",
    default_meta_title_uz:
      "Possible Group — biznes avtomatlashtirish, CRM/ERP, saytlar va botlar",
    default_meta_desc_ru:
      "Автоматизируем ритейл, общепит и дистрибуцию в Узбекистане: CRM, ERP, POS, сайты, мобильные приложения, Telegram-боты.",
    default_meta_desc_uz:
      "O‘zbekistonda retail, umumiy ovqatlanish va distribyutsiya uchun avtomatlashtirish: CRM, ERP, POS, saytlar, mobil ilovalar va Telegram-botlar.",
    default_og_image: "",
    analytics_head: "",
    analytics_body: "",
  } as any;

  return (
    <div className="space-y-6">
      {isSaved && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
          <div className="font-semibold text-emerald-200">
            Настройки сохранены
          </div>
          <div className="mt-1 text-[11px] text-emerald-100/80">
            Все изменения применены. Публичные страницы будут перегенерированы
            с учётом новых SEO-данных и контактов.
          </div>
        </div>
      )}
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Настройки сайта
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Здесь настраиваются бренд, контакты, соцсети и базовые SEO-данные,
            которые будут использоваться по умолчанию для страниц, услуг,
            кейсов и блога.
          </p>
        </div>
      </header>

      <form action={saveSettings} className="space-y-6">
        {/* Бренд и контакты */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Бренд и контакты
          </h2>

          <div className="grid gap-4 md:grid-cols-2 text-xs">
            <div className="space-y-1 md:col-span-2">
              <label className="text-neutral-300">Название компании</label>
              <input
                type="text"
                name="company_name"
                defaultValue={initial.company_name}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="Possible Group"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300">Телефон</label>
              <input
                type="text"
                name="phone"
                defaultValue={initial.phone}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="+998 (90) 000-00-00"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300">E-mail</label>
              <input
                type="email"
                name="email"
                defaultValue={initial.email}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="info@possible.uz"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-neutral-300">Адрес</label>
              <input
                type="text"
                name="address"
                defaultValue={initial.address}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="г. Ташкент, ..."
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 text-xs pt-4 border-t border-white/5">
            <div className="space-y-3">
              <ImageUploadField
                name="logo"
                label="Логотип (header/футер)"
                defaultValue={initial.logo ?? ""}
              />
            </div>
            <div className="space-y-3">
              <ImageUploadField
                name="favicon"
                label="Favicon (иконка вкладки)"
                defaultValue={initial.favicon ?? ""}
              />
              <p className="text-[11px] text-neutral-500">
                Желательно квадратное изображение 32×32 или 64×64 в формате
                PNG или SVG.
              </p>
            </div>
          </div>
        </section>

        {/* Соцсети */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">Соцсети</h2>
          <div className="grid gap-4 md:grid-cols-2 text-xs">
            <div className="space-y-1">
              <label className="text-neutral-300">Telegram</label>
              <input
                type="text"
                name="telegram_url"
                defaultValue={initial.telegram_url}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="https://t.me/possible_group"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-300">WhatsApp</label>
              <input
                type="text"
                name="whatsapp_url"
                defaultValue={initial.whatsapp_url}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="https://wa.me/99890..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-300">Instagram</label>
              <input
                type="text"
                name="instagram_url"
                defaultValue={initial.instagram_url}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="https://www.instagram.com/possible.group"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-300">Facebook</label>
              <input
                type="text"
                name="facebook_url"
                defaultValue={initial.facebook_url}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-300">LinkedIn</label>
              <input
                type="text"
                name="linkedin_url"
                defaultValue={initial.linkedin_url}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
                placeholder="https://www.linkedin.com/company/possible-group"
              />
            </div>
          </div>
        </section>

        {/* SEO по умолчанию */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">SEO по умолчанию</h2>
          <p className="text-xs text-neutral-400">
            Эти значения будут использоваться, если страница, услуга или кейс
            не задали свои meta-title и description. Хорошо пропиши здесь
            главное позиционирование Possible Group.
          </p>

          <div className="grid gap-4 md:grid-cols-2 text-xs mt-2">
            <div className="space-y-2">
              <label className="text-neutral-300">Default meta title (RU)</label>
              <input
                type="text"
                name="default_meta_title_ru"
                defaultValue={initial.default_meta_title_ru}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
              <label className="text-neutral-300">
                Default meta description (RU)
              </label>
              <textarea
                name="default_meta_desc_ru"
                rows={3}
                defaultValue={initial.default_meta_desc_ru}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-neutral-300">Default meta title (UZ)</label>
              <input
                type="text"
                name="default_meta_title_uz"
                defaultValue={initial.default_meta_title_uz}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
              <label className="text-neutral-300">
                Default meta description (UZ)
              </label>
              <textarea
                name="default_meta_desc_uz"
                rows={3}
                defaultValue={initial.default_meta_desc_uz}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 text-xs pt-4 border-t border-white/5">
            <div className="space-y-2">
              <ImageUploadField
                name="default_og_image"
                label="Default OG image (для шеринга, если у страницы нет своей)"
                defaultValue={initial.default_og_image ?? ""}
              />
              <p className="text-[11px] text-neutral-500">
                Рекомендуемый размер 1200×630. Используется в соцсетях и
                мессенджерах, если у страницы нет собственного og:image.
              </p>
            </div>
          </div>
        </section>

        {/* Скрипты аналитики */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Аналитика и пиксели
          </h2>
          <p className="text-xs text-neutral-400">
            Сюда можно вставить коды Google Analytics, Meta Pixel, Yandex
            Metrika и других систем. Будь аккуратен: вставляй только проверенный
            код.
          </p>

          <div className="grid gap-4 md:grid-cols-2 text-xs mt-2">
            <div className="space-y-2">
              <label className="text-neutral-300">
                Скрипты в &lt;head&gt;
              </label>
              <textarea
                name="analytics_head"
                rows={8}
                defaultValue={initial.analytics_head}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 font-mono text-[11px] text-neutral-200 outline-none focus:border-cyan-400"
                placeholder="&lt;script&gt;...&lt;/script&gt;"
              />
            </div>
            <div className="space-y-2">
              <label className="text-neutral-300">
                Скрипты перед &lt;/body&gt;
              </label>
              <textarea
                name="analytics_body"
                rows={8}
                defaultValue={initial.analytics_body}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 font-mono text-[11px] text-neutral-200 outline-none focus:border-cyan-400"
                placeholder="&lt;script&gt;...&lt;/script&gt;"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
          >
            Сохранить настройки
          </button>
        </div>
      </form>
    </div>
  );
}