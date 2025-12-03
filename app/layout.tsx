// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Possible Group",
  description: "Автоматизация бизнеса, CRM, ERP, POS, интеграции",
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

