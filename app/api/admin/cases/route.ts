import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(cases);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.case.create({ data });
  return NextResponse.json(created);
}

