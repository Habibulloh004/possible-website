import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.review.create({ data });
  return NextResponse.json(created);
}
