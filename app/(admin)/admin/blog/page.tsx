

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const total = posts.length;
  const published = posts.filter((p) => p.is_published).length;
  const drafts = total - published;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Блог / статьи</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Управляй контентом, который будет собирать SEO-трафик и прогревать
            аудиторию Possible Group.
          </p>
        </div>

        <a
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow hover:bg-neutral-100"
        >
          <span className="text-lg leading-none">＋</span>
          <span>Новая статья</span>
        </a>
      </header>

      {/* Stats */}
      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-neutral-950/80 px-4 py-3 text-xs">
          <p className="text-neutral-400">Всего статей</p>
          <p className="mt-1 text-xl font-semibold text-white">{total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-xs">
          <p className="text-emerald-300">Опубликовано</p>
          <p className="mt-1 text-xl font-semibold text-emerald-100">
            {published}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs">
          <p className="text-amber-300">Черновики</p>
          <p className="mt-1 text-xl font-semibold text-amber-100">
            {drafts}
          </p>
        </div>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80">
        <div className="border-b border-white/5 px-4 py-3 text-xs text-neutral-400">
          Управление статьями: заголовки RU/UZ, категории, статус публикации и
          SEO-структура.
        </div>

        {posts.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-neutral-500">
            Пока статей нет. Нажми «Новая статья», чтобы добавить первый
            материал.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-neutral-950/90 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Заголовок</th>
                  <th className="px-4 py-3">Категория</th>
                  <th className="px-4 py-3">Slug (RU)</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Опубликовано</th>
                  <th className="px-4 py-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const categoryName =
                    post.category?.name_ru || post.category?.name_uz || "—";

                  return (
                    <tr
                      key={post.id}
                      className="border-b border-white/5/10 hover:bg-neutral-900/60"
                    >
                      <td className="px-4 py-3 align-top text-neutral-400">
                        {post.id}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="max-w-xs truncate text-[13px] font-medium text-white">
                          {post.title_ru || post.title_uz}
                        </div>
                        <div className="mt-0.5 line-clamp-1 max-w-xs text-[11px] text-neutral-500">
                          {post.excerpt_ru || post.excerpt_uz}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-[11px] text-neutral-300">
                        {categoryName}
                      </td>
                      <td className="px-4 py-3 align-top text-[11px] text-neutral-400">
                        {post.slug_ru}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {post.is_published ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-500/40">
                            ● опубликовано
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300 ring-1 ring-amber-500/40">
                            ● черновик
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top text-[11px] text-neutral-400">
                        {post.published_at
                          ? new Date(
                              post.published_at as unknown as string
                            ).toLocaleDateString("ru-RU")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 align-top text-right">
                        <a
                          href={`/admin/blog/${post.id}`}
                          className="text-[11px] font-medium text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
                        >
                          Редактировать
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}