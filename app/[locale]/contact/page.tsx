"use client";

import { useState, FormEvent } from "react";
import { isLocale, type Locale } from "@/lib/i18n";

export default function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "ru";
  const isRu = locale === "ru";
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      contact: formData.get("contact"),
      comment: formData.get("comment"),
    };
    const message = `📩 Новый запрос\n\n👤 Имя: ${payload.name}\n📞 Телефон: ${payload.contact}\n📝 Задача: ${payload.comment || "—"}`;
    await fetch(`https://api.telegram.org/bot6375765924:AAG_rVeEquNTzONxD6A856Rw9csGsLRVBXQ/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: "-4020548368", text: message }),
    });
    setIsSending(false);
    setSent(true);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 pb-10 space-y-10">
      {toast && (
        <div
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black text-sm font-medium px-5 py-2 rounded-xl shadow-lg"
          style={{ animation: "fadeIn .3s ease, fadeOut .3s ease 2.7s forwards" }}
        >
          {isRu ? "Заявка успешно отправлена!" : "So‘rov muvaffaqiyatli yuborildi!"}
        </div>
      )}
      {/* фоновый градиент */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-4 h-56 w-56 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute right-0 top-64 h-64 w-64 rounded-full bg-sky-500/25 blur-3xl" />
      </div>

      <header className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          {isRu
            ? "Заявка на автоматизацию бизнеса с Possible Group"
            : "Possible Group bilan biznesni avtomatlashtirish uchun so‘rov"}
        </h1>
        <p className="text-sm md:text-base text-neutral-400">
          {isRu
            ? "Оставьте номер телефона — поможем подобрать решение по автоматизации: POS, CRM, ERP, интеграции для бизнеса в Узбекистане."
            : "Telefon raqamingizni qoldiring — O‘zbekistondagi biznesingiz uchun POS, CRM, ERP va integratsiya bo‘yicha eng to‘g‘ri yechimni tanlashda yordam beramiz."}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-neutral-950/85 p-5 shadow-[0_0_25px_rgba(0,0,0,0.55)]"
      >
        <div className="space-y-1 text-sm">
          <label className="text-neutral-200">
            {isRu ? "Имя" : "Ism"}
          </label>
          <input
            name="name"
            required
            placeholder={isRu ? "Как к вам обращаться" : "Ismingiz"}
            className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-neutral-200">
            {isRu ? "Телефон" : "Telefon"}
          </label>
          <input
            name="contact"
            required
            placeholder="+998 90 123 45 67"
            className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-neutral-200">
            {isRu ? "Кратко о задаче (необязательно)" : "Vazifa (majburiy emas)"}
          </label>
          <textarea
            name="comment"
            rows={3}
            placeholder={
              isRu
                ? "Например: нужно автоматизировать доставку и склад"
                : "Masalan: dostavka va omborni avtomatlashtirish kerak"
            }
            className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="mt-2 w-full rounded-full bg-white py-2.5 text-sm font-medium text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {isSending
            ? isRu
              ? "Отправляем..."
              : "Yuborilmoqda..."
            : isRu
            ? "Отправить"
            : "Yuborish"}
        </button>

        {sent && (
          <p className="mt-2 text-xs text-emerald-300">
            {isRu
              ? "Заявка отправлена! Мы скоро свяжемся."
              : "So‘rov yuborildi! Tez orada aloqaga chiqamiz."}
          </p>
        )}
      </form>

      <section className="space-y-2 text-xs md:text-sm text-neutral-400">
        <h2 className="text-sm font-semibold text-neutral-200">
          {isRu
            ? "Автоматизация бизнеса в Узбекистане: POS, CRM, ERP и интеграции"
            : "O‘zbekistonda biznes avtomatlashtirish: POS, CRM, ERP va integratsiyalar"}
        </h2>
        <p>
          {isRu
            ? "Possible Group помогает навести порядок в учёте, продажах и операциях: внедряем кассовые системы, CRM, ERP, онлайн-оплату, доставку и кастомные интеграции под ваш бизнес."
            : "Possible Group hisob-kitob, savdo va jarayonlarda tartib o‘rnatishga yordam beradi: kassa tizimlari, CRM, ERP, onlayn to‘lov, yetkazib berish va biznesingizga mos integratsiyalarni joriy qilamiz."}
        </p>
        <p>
          {isRu
            ? "Работаем с ритейлом, общепитом, доставкой, дистрибуцией и услугами по всей республике."
            : "Butiklar, restoranlar, dostavka, distribyutsiya va xizmat ko‘rsatish sohalari bilan butun respublika bo‘ylab ishlaymiz."}
        </p>
      </section>

      <p className="text-center text-xs text-neutral-400">
        {isRu ? "Или сразу позвоните:" : "Yoki darhol qo‘ng‘iroq qiling:"}{" "}
        <a
          href="tel:+998958331020"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-emerald-300 hover:text-emerald-200"
        >
          +998 95 833 10 20
        </a>
      </p>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: isRu
              ? "Заявка на автоматизацию бизнеса — Possible Group"
              : "Biznesni avtomatlashtirish bo‘yicha so‘rov — Possible Group",
            description: isRu
              ? "Страница контактов Possible Group для запроса автоматизации бизнеса: POS, CRM, ERP, integratsiyalar va SaaS yechimlar O‘zbekiston bozorida."
              : "Possible Group bilan O‘zbekistonda biznesni avtomatlashtirish uchun aloqa sahifasi: POS, CRM, ERP, integratsiyalar va SaaS yechimlar.",
            url:
              typeof window !== "undefined"
                ? window.location.href
                : "https://possible.uz/contact",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://possible.uz/contact",
            },
            publisher: {
              "@type": "Organization",
              name: "Possible Group",
              address: {
                "@type": "PostalAddress",
                addressCountry: "UZ",
                addressLocality: "Tashkent",
              },
              telephone: "+998958331020",
            },
          }),
        }}
      />
    </div>
  );
}
