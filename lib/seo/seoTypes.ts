import type { Locale } from "../i18n";

export type SeoEntity = {
  meta_title_ru?: string | null;
  meta_title_uz?: string | null;
  meta_description_ru?: string | null;
  meta_description_uz?: string | null;
  canonical_url?: string | null;
  og_title_ru?: string | null;
  og_title_uz?: string | null;
  og_description_ru?: string | null;
  og_description_uz?: string | null;
  og_image?: string | null;
  index?: boolean | null;
};
