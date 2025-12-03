"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/admin/dashboard"
    });

    if ((res as any)?.error) {
      setError("Неверный email или пароль");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-white/5 bg-neutral-900/90 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="mb-6 space-y-1">
          <h1 className="text-xl font-semibold">Admin login</h1>
          <p className="text-xs text-neutral-400">
            Вход в панель управления Possible Group.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="block text-neutral-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none ring-0 transition focus:border-white/40 focus:bg-black"
              required
            />
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="block text-neutral-200">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40 focus:bg-black"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-white py-2 text-sm font-medium text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-neutral-500">
          Сделано Possible Group · Секретная зона 🛡️
        </div>
      </div>
    </div>
  );
}
