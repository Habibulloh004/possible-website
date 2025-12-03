

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
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
          className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow hover:bg-neutral-100"
        >
          + Добавить отзыв
        </a>
      </header>

      {/* Table */}
      <section className="rounded-3xl border border-white/10 bg-neutral-950/80 p-4 md:p-5">
        {reviews.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Отзывов пока нет. Добавь первые кейсовые отзывы клиентов, с которыми
            вы уже сделали проекты.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs md:text-sm">
              <thead className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                <tr>
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Клиент</th>
                  <th className="py-2 pr-3">Компания</th>
                  <th className="py-2 pr-3">Оценка</th>
                  <th className="py-2 pr-3">Витрина</th>
                  <th className="py-2 pr-3 hidden md:table-cell">Создан</th>
                  <th className="py-2 pl-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-white/5 text-[11px] md:text-xs hover:bg-white/5"
                  >
                    <td className="py-2 pr-3 align-middle text-neutral-300">
                      {r.id}
                    </td>
                    <td className="py-2 pr-3 align-middle">
                      <div className="flex flex-col">
                        <span className="text-neutral-100">{r.client_name}</span>
                        {r.position && (
                          <span className="text-[10px] text-neutral-500">
                            {r.position}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 pr-3 align-middle text-neutral-300">
                      {r.company || "—"}
                    </td>
                    <td className="py-2 pr-3 align-middle">
                      <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-100">
                        {r.rating} / 5
                      </span>
                    </td>
                    <td className="py-2 pr-3 align-middle">
                      {r.is_featured ? (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                          На главной
                        </span>
                      ) : (
                        <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300">
                          Обычный
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3 align-middle text-neutral-500 hidden md:table-cell">
                      {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="py-2 pl-3 align-middle text-right">
                      <a
                        href={`/admin/reviews/${r.id}`}
                        className="text-[11px] font-medium text-sky-300 hover:text-sky-200"
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