import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  const review = await prisma.review.findUnique({
    where: { id: Number(params.id) },
  });
  return NextResponse.json(review);
}

export async function PUT(req: Request, { params }: Params) {
  const data = await req.json();
  const updated = await prisma.review.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.review.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ ok: true });
}
