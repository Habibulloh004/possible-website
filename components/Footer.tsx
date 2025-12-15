"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const contactItems = [
  {
    type: "icon",
    icon: PhoneIcon,
    label: "+998 95 833 10 20",
    href: "tel:+998958331020",
  },
  {
    type: "icon",
    icon: EnvelopeIcon,
    label: "possibleuz@gmail.com",
    href: "mailto:possibleuz@gmail.com",
  },
  {
    type: "image",
    label: "Instagram",
    href: "https://www.instagram.com/possible_company_/",
    imageSrc: "/instagram.svg",
  },
  {
    type: "image",
    label: "Telegram",
    href: "http://t.me/possible_company",
    imageSrc: "/telegram.svg",
  },
  {
    type: "icon",
    icon: MapPinIcon,
    label: "Toshkent shahar, Yashnobod tumani, Zumrad 12",
    href: "https://www.google.com/maps?q=41.280054,69.351099",
  },
] as const;

export default function Footer() {
  const pathname = usePathname() || "/ru";
  const locale = pathname.split("/")[1] === "uz" ? "uz" : "ru";

  return (
    <footer className="border-t border-white/10 bg-black/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-4 text-sm text-neutral-300 md:flex-row md:items-center md:justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 text-white"
        >
          <Image
            src="/logo.jpg"
            alt="Possible Group logo"
            width={70}
            height={70}
            className="h-14 w-14 rounded-full object-contain"
          />
          {/* <div className="text-base font-semibold tracking-tight">
            Possible Group
          </div> */}
        </Link>
        <div className="flex flex-wrap gap-3 md:justify-end">
          {contactItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-200 transition hover:border-white/40 hover:text-white"
            >
              {item.type === "image" ? (
                <Image
                  src={item.imageSrc}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 invert"
                  aria-hidden="true"
                />
              ) : (
                <item.icon className="h-5 w-5" aria-hidden="true" />
              )}
              <span className="sr-only">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
