// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs"; // нужен нормальный fs

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "Файл не передан" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || ".jpg";
  const baseName = path.basename(file.name, ext);
  const safeBase = baseName.replace(/[^a-z0-9-_]/gi, "_").slice(0, 40);
  const fileName = `${safeBase}-${Date.now()}${ext.toLowerCase()}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Vercel Blob keeps uploads persistent in production
    const blob = await put(`uploads/${fileName}`, buffer, {
      access: "public",
      contentType: file.type || "application/octet-stream",
    });

    return NextResponse.json({ url: blob.url });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  const url = `/uploads/${fileName}`;

  return NextResponse.json({ url });
}
