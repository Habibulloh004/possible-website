

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  await requireAdmin();

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl w-full space-y-6 p-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Отзывы</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Управляй социальным доказательством: реальные отзывы клиентов усиливают
            доверие к Possible Group и помогают закрывать сделки.
          </p>
        </div>

        <a
          href="/admin/reviews/new"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black shadow-lg shadow-white/20 hover:bg-neutral-100 transition-all"
        >
          <span className="text-lg leading-none">＋</span>
          <span>Добавить отзыв</span>
        </a>
      </header>

      {/* Table */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl">
        {reviews.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-neutral-400">
            Отзывов пока нет.{" "}
            <a
              href="/admin/reviews/new"
              className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
            >
              Добавь первый отзыв →
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-neutral-900/60 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Клиент</th>
                  <th className="px-6 py-4">Компания</th>
                  <th className="px-6 py-4">Оценка</th>
                  <th className="px-6 py-4">Витрина</th>
                  <th className="px-6 py-4">Создан</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-white/5 transition hover:bg-neutral-900/40"
                  >
                    <td className="px-6 py-4 align-middle text-neutral-400">
                      {r.id}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{r.client_name}</span>
                        {r.position && (
                          <span className="text-xs text-neutral-500 mt-0.5">
                            {r.position}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-neutral-300">
                      {r.company || "—"}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-100">
                        {r.rating} / 5
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {r.is_featured ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/40">
                          На главной
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-neutral-800/80 px-2.5 py-1 text-xs text-neutral-400">
                          Обычный
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-middle text-xs text-neutral-500">
                      {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <a
                        href={`/admin/reviews/${r.id}`}
                        className="text-xs font-medium text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors"
                      >
                        Редактировать
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}