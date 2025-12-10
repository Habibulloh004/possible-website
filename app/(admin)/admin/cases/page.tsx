import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminCasesPage() {
  await requireAdmin();

  const cases = await prisma.case.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-6 space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Кейсы</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Живые бизнесы, с которыми мы работаем — результаты внедрения автоматизации.
          </p>
        </div>

        <Link
          href="/admin/cases/new"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black shadow-lg shadow-white/20 hover:bg-neutral-100 transition-all"
        >
          <span className="text-lg leading-none">＋</span>
          <span>Добавить кейс</span>
        </Link>
      </header>

      {/* Table */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl">
        {cases.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-neutral-400">
            Пока нет кейсов.{" "}
            <Link
              href="/admin/cases/new"
              className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
            >
              Добавьте первый →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-neutral-900/60 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Клиент</th>
                  <th className="px-6 py-4">Отрасль</th>
                  <th className="px-6 py-4">Заголовок RU</th>
                  <th className="px-6 py-4">Заголовок UZ</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>

              <tbody>
                {cases.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-white/5 transition hover:bg-neutral-900/40"
                  >
                    <td className="px-6 py-4 text-neutral-400">{c.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{c.client_name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300 ring-1 ring-emerald-500/30">
                        {c.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-200">{c.title_ru}</td>
                    <td className="px-6 py-4 text-neutral-300">{c.title_uz}</td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/cases/${c.id}`}
                        className="text-xs font-medium text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors"
                      >
                        Редактировать
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}