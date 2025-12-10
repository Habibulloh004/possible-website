import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.category.create({ data });
  return NextResponse.json(created);
}
