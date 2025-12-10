// app/[locale]/layout.tsx
import Navbar from "@/components/Navbar";

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "uz" }];
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // locale Navbar сам берёт из URL через usePathname
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
