import { prisma } from "@/lib/prisma";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl w-full space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Услуги</h1>

        <a
          href="/admin/services/new"
          className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black shadow hover:bg-neutral-200"
        >
          + Добавить услугу
        </a>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur">
        <table className="w-full text-left text-sm text-white">
          <thead className="bg-neutral-900/40 text-xs uppercase text-neutral-400">
            <tr>
              <th className="py-3 pl-4">ID</th>
              <th className="py-3">Название (RU)</th>
              <th className="py-3">Название (UZ)</th>
              <th className="py-3">Slug (RU)</th>
              <th className="py-3">Slug (UZ)</th>
              <th className="py-3 pr-4 text-right">Действия</th>
            </tr>
          </thead>

          <tbody>
            {services.map((s) => (
              <tr
                key={s.id}
                className="border-t border-white/5 transition hover:bg-neutral-800/30"
              >
                <td classname="py-3 pl-4">{s.id}</td>
                <td className="py-3">{s.title_ru}</td>
                <td className="py-3">{s.title_uz}</td>
                <td className="py-3">{s.slug_ru}</td>
                <td className="py-3">{s.slug_uz}</td>

                <td className="py-3 pr-4 text-right">
                  <a
                    href={`/admin/services/${s.id}`}
                    className="rounded-lg px-3 py-1 text-xs text-cyan-400 underline hover:text-cyan-300"
                  >
                    Редактировать
                  </a>
                </td>
              </tr>
            ))}

            {services.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-neutral-400 text-sm"
                >
                  Услуг пока нет.  
                  <a
                    href="/admin/services/new"
                    className="text-cyan-400 underline hover:text-cyan-300"
                  >
                    Создать первую →
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}