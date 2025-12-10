import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminServicesPage() {
  await requireAdmin();

  const services = await prisma.service.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl w-full space-y-6 p-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Услуги</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Мы собираем CRM, ERP, POS, интеграции и кастомные решения в один управляемый контур. Ниже — основные направления, с которыми мы работаем.
          </p>
        </div>

        <a
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black shadow-lg shadow-white/20 hover:bg-neutral-100 transition-all"
        >
          <span className="text-lg leading-none">＋</span>
          <span>Добавить услугу</span>
        </a>
      </header>

      {/* Table */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl">
        {services.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-neutral-400">
            Услуг пока нет.{" "}
            <a
              href="/admin/services/new"
              className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
            >
              Создать первую →
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-neutral-900/60 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Название (RU)</th>
                  <th className="px-6 py-4">Название (UZ)</th>
                  <th className="px-6 py-4">Slug (RU)</th>
                  <th className="px-6 py-4">Slug (UZ)</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>

              <tbody>
                {services.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-white/5 transition hover:bg-neutral-900/40"
                  >
                    <td className="px-6 py-4 text-neutral-400">{s.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{s.title_ru}</td>
                    <td className="px-6 py-4 text-neutral-300">{s.title_uz}</td>
                    <td className="px-6 py-4 text-xs text-neutral-400">{s.slug_ru}</td>
                    <td className="px-6 py-4 text-xs text-neutral-400">{s.slug_uz}</td>

                    <td className="px-6 py-4 text-right">
                      <a
                        href={`/admin/services/${s.id}`}
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