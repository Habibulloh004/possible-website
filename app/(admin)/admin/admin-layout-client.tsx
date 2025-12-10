"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminSession } from "@/lib/admin-auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/services", label: "Услуги" },
  { href: "/admin/cases", label: "Кейсы" },
  { href: "/admin/blog", label: "Блог" },
  { href: "/admin/reviews", label: "Отзывы" },
  { href: "/admin/settings", label: "Настройки" }
];

export default function AdminLayoutClient({
  children,
  session
}: {
  children: ReactNode;
  session: AdminSession | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!session && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [session, pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Login page has its own layout (no sidebar)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // For other pages, if no session, show a loading state while redirect happens
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-cyan-500/30 border-t-cyan-500"></div>
          <p className="mt-4 text-sm text-neutral-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-neutral-950 to-neutral-900 text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-white/5 bg-black/60 px-5 py-6 backdrop-blur-xl md:flex md:flex-col">
        {/* Лого */}
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-black text-xl font-bold tracking-tight">
            P
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-[0.18em]">
              POSSIBLE
            </div>
            <div className="text-[11px] uppercase text-neutral-400 tracking-[0.2em]">
              ADMIN PANEL
            </div>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex flex-1 flex-col gap-1 text-sm">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 transition 
                ${
                  active
                    ? "bg-white text-black shadow-lg shadow-white/10"
                    : "text-neutral-300 hover:bg-neutral-800/70 hover:text-white"
                }`}
              >
                <span className="w-1 rounded-full bg-white/60" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Низ сайдбара */}
        <div className="mt-6 space-y-3 border-t border-white/5 pt-4">
          <div className="flex items-center justify-between text-xs">
            <div className="text-neutral-400">
              <div className="font-medium text-white">{session?.username}</div>
              <div className="text-[10px] text-neutral-500">Администратор</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-300 transition hover:bg-white/10 hover:text-white"
          >
            Выйти
          </button>
          <div className="text-[10px] text-neutral-600 text-center">
            Possible Group · {new Date().getFullYear()}
          </div>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1">
        <div className="flex min-h-screen flex-col px-4 py-4 md:px-10 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
