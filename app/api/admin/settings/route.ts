import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const settings = await prisma.siteSettings.findFirst();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const data = await req.json();

  const updated = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  return NextResponse.json(updated);
}
