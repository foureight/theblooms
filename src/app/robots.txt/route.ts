import { siteUrl } from "@/lib/seo";

/** Custom robots.txt so we can advertise llms.txt for AI crawlers. */
export function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    "Allow: /llms.txt",
    "Disallow: /admin",
    "Disallow: /api/",
    "Disallow: /kosik",
    "Disallow: /pokladna",
    "",
    `Host: ${siteUrl}`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `# LLM / AI context: ${siteUrl}/llms.txt`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
