"use client";

import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/locales";

type Props = { locale: Locale };

export default function MainHeader({ locale }: Props) {
  const dict = getDictionary(locale);

  return (
    <header className="border-b border-neutral-800 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`}>
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Possible Group"
              width={40}
              height={40}
            />
            <span className="text-lg font-semibold tracking-[0.2em]">
              POSSIBLE GROUP
            </span>
          </div>
        </Link>

        <nav className="hidden gap-6 text-sm md:flex">
          <Link href={`/${locale}/services`}>{dict.nav.services}</Link>
          <Link href={`/${locale}/cases`}>{dict.nav.cases}</Link>
          <Link href={`/${locale}/blog`}>{dict.nav.blog}</Link>
          <Link href={`/${locale}/reviews`}>{dict.nav.reviews}</Link>
          <Link href={`/${locale}/about`}>{dict.nav.about}</Link>
          <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/contact`}
            className="hidden rounded-full border border-white px-4 py-1 text-xs uppercase tracking-wide md:inline-block"
          >
            {dict.cta.consult}
          </Link>
          <Link href="/ru" className={locale === "ru" ? "font-bold" : ""}>
            RU
          </Link>
          <span>/</span>
          <Link href="/uz" className={locale === "uz" ? "font-bold" : ""}>
            UZ
          </Link>
        </div>
      </div>
    </header>
  );
}
