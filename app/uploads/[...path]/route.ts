import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { resolveUploadPath } from "@/lib/uploads";

export const runtime = "nodejs";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

function getMimeType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

export async function GET(
  _request: Request,
  { params }: { params: { path: string[] } }
) {
  const relativePath = params.path?.join("/");
  if (!relativePath) {
    return new NextResponse("Not found", { status: 404 });
  }

  let filePath: string;
  try {
    filePath = resolveUploadPath(relativePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(filePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": getMimeType(filePath),
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") {
      return new NextResponse("Not found", { status: 404 });
    }

    console.error("Failed to read upload", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
