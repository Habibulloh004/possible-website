/*
  Warnings:

  - You are about to drop the column `meta_keywords_ru` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `meta_keywords_uz` on the `Post` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug_ru" TEXT NOT NULL,
    "slug_uz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "title_uz" TEXT NOT NULL,
    "excerpt_ru" TEXT NOT NULL,
    "excerpt_uz" TEXT NOT NULL,
    "content_ru" TEXT NOT NULL,
    "content_uz" TEXT NOT NULL,
    "tags" TEXT,
    "published_at" DATETIME,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER,
    "meta_title_ru" TEXT,
    "meta_title_uz" TEXT,
    "meta_description_ru" TEXT,
    "meta_description_uz" TEXT,
    "canonical_url" TEXT,
    "og_title_ru" TEXT,
    "og_title_uz" TEXT,
    "og_description_ru" TEXT,
    "og_description_uz" TEXT,
    "og_image" TEXT,
    "index" BOOLEAN NOT NULL DEFAULT true,
    "sitemap_priority" REAL DEFAULT 0.7,
    "sitemap_changefreq" TEXT DEFAULT 'weekly',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("canonical_url", "categoryId", "content_ru", "content_uz", "createdAt", "excerpt_ru", "excerpt_uz", "id", "index", "is_published", "meta_description_ru", "meta_description_uz", "meta_title_ru", "meta_title_uz", "og_description_ru", "og_description_uz", "og_image", "og_title_ru", "og_title_uz", "published_at", "sitemap_changefreq", "sitemap_priority", "slug_ru", "slug_uz", "tags", "title_ru", "title_uz", "updatedAt") SELECT "canonical_url", "categoryId", "content_ru", "content_uz", "createdAt", "excerpt_ru", "excerpt_uz", "id", "index", "is_published", "meta_description_ru", "meta_description_uz", "meta_title_ru", "meta_title_uz", "og_description_ru", "og_description_uz", "og_image", "og_title_ru", "og_title_uz", "published_at", "sitemap_changefreq", "sitemap_priority", "slug_ru", "slug_uz", "tags", "title_ru", "title_uz", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_ru_key" ON "Post"("slug_ru");
CREATE UNIQUE INDEX "Post_slug_uz_key" ON "Post"("slug_uz");
CREATE INDEX "Post_slug_ru_idx" ON "Post"("slug_ru");
CREATE INDEX "Post_slug_uz_idx" ON "Post"("slug_uz");
CREATE INDEX "Post_is_published_published_at_idx" ON "Post"("is_published", "published_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Case_slug_ru_idx" ON "Case"("slug_ru");

-- CreateIndex
CREATE INDEX "Case_slug_uz_idx" ON "Case"("slug_uz");

-- CreateIndex
CREATE INDEX "Case_industry_idx" ON "Case"("industry");

-- CreateIndex
CREATE INDEX "Category_slug_ru_idx" ON "Category"("slug_ru");

-- CreateIndex
CREATE INDEX "Category_slug_uz_idx" ON "Category"("slug_uz");

-- CreateIndex
CREATE INDEX "Review_is_featured_idx" ON "Review"("is_featured");

-- CreateIndex
CREATE INDEX "Service_slug_ru_idx" ON "Service"("slug_ru");

-- CreateIndex
CREATE INDEX "Service_slug_uz_idx" ON "Service"("slug_uz");
