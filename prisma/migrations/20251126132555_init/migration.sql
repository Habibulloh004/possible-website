-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug_ru" TEXT NOT NULL,
    "slug_uz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "title_uz" TEXT NOT NULL,
    "short_description_ru" TEXT NOT NULL,
    "short_description_uz" TEXT NOT NULL,
    "content_ru" TEXT NOT NULL,
    "content_uz" TEXT NOT NULL,
    "icon" TEXT,
    "meta_title_ru" TEXT,
    "meta_title_uz" TEXT,
    "meta_description_ru" TEXT,
    "meta_description_uz" TEXT,
    "meta_keywords_ru" TEXT,
    "meta_keywords_uz" TEXT,
    "canonical_url" TEXT,
    "og_title_ru" TEXT,
    "og_title_uz" TEXT,
    "og_description_ru" TEXT,
    "og_description_uz" TEXT,
    "og_image" TEXT,
    "index" BOOLEAN NOT NULL DEFAULT true,
    "sitemap_priority" REAL DEFAULT 0.8,
    "sitemap_changefreq" TEXT DEFAULT 'monthly',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Case" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client_name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "slug_ru" TEXT NOT NULL,
    "slug_uz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "title_uz" TEXT NOT NULL,
    "problem_ru" TEXT NOT NULL,
    "problem_uz" TEXT NOT NULL,
    "solution_ru" TEXT NOT NULL,
    "solution_uz" TEXT NOT NULL,
    "result_ru" TEXT NOT NULL,
    "result_uz" TEXT NOT NULL,
    "screenshots" TEXT,
    "launch_date" DATETIME,
    "serviceId" INTEGER,
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
    "sitemap_priority" REAL DEFAULT 0.6,
    "sitemap_changefreq" TEXT DEFAULT 'monthly',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Case_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug_ru" TEXT NOT NULL,
    "slug_uz" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_uz" TEXT NOT NULL,
    "description_ru" TEXT,
    "description_uz" TEXT,
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
    "sitemap_priority" REAL DEFAULT 0.5,
    "sitemap_changefreq" TEXT DEFAULT 'monthly',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
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

-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client_name" TEXT NOT NULL,
    "position" TEXT,
    "company" TEXT,
    "text_ru" TEXT NOT NULL,
    "text_uz" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "avatar" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "company_name" TEXT NOT NULL,
    "logo" TEXT,
    "favicon" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "email" TEXT,
    "telegram_url" TEXT,
    "whatsapp_url" TEXT,
    "instagram_url" TEXT,
    "facebook_url" TEXT,
    "linkedin_url" TEXT,
    "default_meta_title_ru" TEXT,
    "default_meta_title_uz" TEXT,
    "default_meta_desc_ru" TEXT,
    "default_meta_desc_uz" TEXT,
    "default_og_image" TEXT,
    "analytics_head" TEXT,
    "analytics_body" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_ru_key" ON "Service"("slug_ru");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_uz_key" ON "Service"("slug_uz");

-- CreateIndex
CREATE UNIQUE INDEX "Case_slug_ru_key" ON "Case"("slug_ru");

-- CreateIndex
CREATE UNIQUE INDEX "Case_slug_uz_key" ON "Case"("slug_uz");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_ru_key" ON "Category"("slug_ru");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_uz_key" ON "Category"("slug_uz");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_ru_key" ON "Post"("slug_ru");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_uz_key" ON "Post"("slug_uz");
