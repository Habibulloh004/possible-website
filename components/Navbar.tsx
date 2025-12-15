"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface NavItem {
  href: string;
  label: string;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/ru";

  // определяем локаль из URL: /ru/... или /uz/...
  const segments = pathname.split("/");
  const locale = segments[1] === "uz" ? "uz" : "ru";
  const isRu = locale === "ru";
  const currentLocale: "ru" | "uz" = isRu ? "ru" : "uz";

  const nav: NavItem[] = [
    { href: `/${locale}`, label: isRu ? "Главная" : "Bosh sahifa" },
    { href: `/${locale}/services`, label: isRu ? "Услуги" : "Xizmatlar" },
    { href: `/${locale}/cases`, label: isRu ? "Кейсы" : "Keyslar" },
    { href: `/${locale}/blog`, label: isRu ? "Блог" : "Blog" },
    { href: `/${locale}/reviews`, label: isRu ? "Отзывы" : "Sharhlar" },
    { href: `/${locale}/about`, label: isRu ? "О компании" : "Biz haqimizda" },
    { href: `/${locale}/contact`, label: isRu ? "Контакты" : "Aloqa" },
  ];

  const isActive = (href: string) => pathname === href;

  // строим URL для переключения языка: меняем только первый сегмент
  const getLangHref = (targetLocale: "ru" | "uz") => {
    const parts = pathname.split("/");
    if (parts.length > 1 && (parts[1] === "ru" || parts[1] === "uz")) {
      parts[1] = targetLocale;
      return parts.join("/") || `/${targetLocale}`;
    }
    return `/${targetLocale}`;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        {/* ЛОГО */}
        <Link
          href={`/${locale}`}
          className="text-white font-semibold text-lg tracking-tight w-40"
        >
          <Image
            src={"/strokeLogo.png"}
            alt={"Logo"}
            // fill
            width={70}
            height={70}
            className="object-contain"
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition ${
                isActive(item.href)
                  ? "text-white font-medium"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Переключатель языка */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <div className="flex items-center rounded-full border border-white/20 bg-black/40 px-1 py-0.5">
              <Link
                href={getLangHref("ru")}
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] transition ${
                  currentLocale === "ru"
                    ? "bg-white text-black"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                <span>🇷🇺</span>
                <span>RU</span>
              </Link>
              <Link
                href={getLangHref("uz")}
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] transition ${
                  currentLocale === "uz"
                    ? "bg-white text-black"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                <span>🇺🇿</span>
                <span>UZ</span>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/${locale}/contact`}
            className="rounded-full bg-white text-black px-4 py-1.5 text-sm font-medium shadow-lg shadow-white/20 hover:bg-neutral-200"
          >
            {isRu ? "Консультация" : "Konsultatsiya"}
          </Link>
        </div>

        {/* MOBILE BURGER */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10">
          <div className="flex flex-col px-4 py-4 gap-4">
            {/* Языки сверху в мобилке */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center rounded-full border border-white/20 bg-black/40 px-1 py-0.5 w-fit">
                <Link
                  href={getLangHref("ru")}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] transition ${
                    currentLocale === "ru"
                      ? "bg-white text-black"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  <span>🇷🇺</span>
                  <span>RU</span>
                </Link>
                <Link
                  href={getLangHref("uz")}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] transition ${
                    currentLocale === "uz"
                      ? "bg-white text-black"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  <span>🇺🇿</span>
                  <span>UZ</span>
                </Link>
              </div>
            </div>

            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`text-sm ${
                  isActive(item.href)
                    ? "text-white font-semibold"
                    : "text-neutral-300"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href={`/${locale}/contact`}
              onClick={() => setOpen(false)}
              className="rounded-full bg-white text-black px-4 py-2 text-sm font-medium text-center"
            >
              {isRu ? "Консультация" : "Konsultatsiya"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
