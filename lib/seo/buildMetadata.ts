import type { Metadata } from "next";
import type { Locale } from "../i18n";
import type { SeoEntity } from "./seoTypes";
import { prisma } from "../prisma";

export async function buildMetadata(
  locale: Locale,
  entity?: SeoEntity,
  path?: string
): Promise<Metadata> {
  const settings = await prisma.siteSettings.findFirst();

  const isRu = locale === "ru";

  const title =
    (isRu ? entity?.meta_title_ru : entity?.meta_title_uz) ??
    (isRu ? settings?.default_meta_title_ru : settings?.default_meta_title_uz) ??
    "Possible Group — автоматизация бизнеса и IT";

  const description =
    (isRu ? entity?.meta_description_ru : entity?.meta_description_uz) ??
    (isRu ? settings?.default_meta_desc_ru : settings?.default_meta_desc_uz) ??
    "Автоматизация бизнеса, CRM/ERP, POS-системы, разработка сайтов и ботов в Узбекистане.";

  const ogTitle =
    (isRu ? entity?.og_title_ru : entity?.og_title_uz) ?? title;

  const ogDescription =
    (isRu ? entity?.og_description_ru : entity?.og_description_uz) ??
    description;

  const urlBase = process.env.NEXT_PUBLIC_SITE_URL || "https://possible.uz";
  const url = path ? `${urlBase}${path}` : urlBase;

  const index = entity?.index ?? true;

  return {
    title,
    description,
    alternates: {
      canonical: entity?.canonical_url || url,
      languages: {
        ru: url.replace("/uz", "/ru"),
        uz: url.replace("/ru", "/uz")
      }
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      siteName: "Possible Group",
      images: [
        entity?.og_image || settings?.default_og_image || "/og-default.png"
      ],
      type: "website"
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false }
  };
}
