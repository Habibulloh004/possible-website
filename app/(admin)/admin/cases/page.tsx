import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCasesPage() {
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Кейсы</h1>

        <Link
          href="/admin/cases/new"
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
        >
          + Добавить кейс
        </Link>
      </div>

      {/* Table */}
      {cases.length === 0 ? (
        <p className="text-neutral-400 text-sm">
          Пока нет кейсов. Добавьте первый.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-900/80 border-b border-white/10">
              <tr className="text-neutral-400 text-xs uppercase">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Клиент</th>
                <th className="px-4 py-3 text-left">Отрасль</th>
                <th className="px-4 py-3 text-left">Заголовок RU</th>
                <th className="px-4 py-3 text-left">Заголовок UZ</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-white/5 hover:bg-neutral-800/40"
                >
                  <td className="px-4 py-4 text-neutral-300">{c.id}</td>
                  <td className="px-4 py-4 text-neutral-200">{c.client_name}</td>
                  <td className="px-4 py-4 text-neutral-200">{c.industry}</td>
                  <td className="px-4 py-4 text-neutral-200">{c.title_ru}</td>
                  <td className="px-4 py-4 text-neutral-200">{c.title_uz}</td>

                  <td className="px-4 py-4 text-right space-x-4">
                    <Link
                      href={`/admin/cases/${c.id}`}
                      className="text-cyan-300 hover:text-cyan-200 text-xs"
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
    </main>
  );
}