import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  const caseItem = await prisma.case.findUnique({
    where: { id: Number(params.id) },
  });
  return NextResponse.json(caseItem);
}

export async function PUT(req: Request, { params }: Params) {
  const data = await req.json();
  const updated = await prisma.case.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.case.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ ok: true });
}
