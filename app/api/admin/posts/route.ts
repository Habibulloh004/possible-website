import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.post.create({ data });
  return NextResponse.json(created);
}
