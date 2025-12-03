import { NextResponse } from "next/server";

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://possible.uz";

  const content = `User-agent: *
Disallow: /admin
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    status: 200,
    headers: { "Content-Type": "text/plain" }
  });
}
