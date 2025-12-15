// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

function resolveSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://possible.uz";
  return raw.includes("://") ? raw : `https://${raw}`;
}

const siteUrl = resolveSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Possible Group",
  description: "Автоматизация бизнеса, CRM, ERP, POS, интеграции",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
