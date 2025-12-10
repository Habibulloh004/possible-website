import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://possible.uz";

  const services = await prisma.service.findMany();
  const cases = await prisma.case.findMany();
  const posts = await prisma.post.findMany({ where: { is_published: true } });

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/ru",
    "/uz",
    "/ru/services",
    "/uz/xizmatlar",
    "/ru/cases",
    "/uz/cases",
    "/ru/blog",
    "/uz/blog",
    "/ru/reviews",
    "/uz/sharhlar",
    "/ru/about",
    "/uz/biz-haqimizda",
    "/ru/contact",
    "/uz/aloqa"
  ].map((p) => ({
    url: `${baseUrl}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7
  }));

  const serviceUrls = services.flatMap((s) => [
    {
      url: `${baseUrl}/ru/services/${s.slug_ru}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly",
      priority: s.sitemap_priority ?? 0.8
    },
    {
      url: `${baseUrl}/uz/xizmatlar/${s.slug_uz}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly",
      priority: s.sitemap_priority ?? 0.8
    }
  ]);

  const caseUrls = cases.flatMap((c) => [
    {
      url: `${baseUrl}/ru/cases/${c.slug_ru}`,
      lastModified: c.updatedAt,
      changeFrequency: "monthly",
      priority: c.sitemap_priority ?? 0.6
    },
    {
      url: `${baseUrl}/uz/cases/${c.slug_uz}`,
      lastModified: c.updatedAt,
      changeFrequency: "monthly",
      priority: c.sitemap_priority ?? 0.6
    }
  ]);

  const postUrls = posts.flatMap((p) => [
    {
      url: `${baseUrl}/ru/blog/${p.slug_ru}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: p.sitemap_priority ?? 0.7
    },
    {
      url: `${baseUrl}/uz/blog/${p.slug_uz}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: p.sitemap_priority ?? 0.7
    }
  ]);

  return [...staticPages, ...serviceUrls, ...caseUrls, ...postUrls] as MetadataRoute.Sitemap;
}
