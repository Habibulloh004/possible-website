import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  // Здесь можно добавить реальную обработку:
  // отправку в Telegram, CRM и т.д.
  // Пока просто возвращаем данные обратно.

  return NextResponse.json(
    {
      ok: true,
      received: body,
    },
    { status: 200 }
  );
}

