// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { promises as fs, existsSync } from "fs";
import path from "path";

export const runtime = "nodejs"; // нужен нормальный fs

function findProjectRoot(startDir = process.cwd()) {
  let currentDir = startDir;

  while (true) {
    if (existsSync(path.join(currentDir, "package.json"))) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return startDir;
    }

    currentDir = parentDir;
  }
}

const uploadRoot = path.join(findProjectRoot(), "public", "uploads");

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

  await fs.mkdir(uploadRoot, { recursive: true });

  const filePath = path.join(uploadRoot, fileName);
  await fs.writeFile(filePath, buffer);

  const url = `/uploads/${fileName}`;

  return NextResponse.json({ url });
}
