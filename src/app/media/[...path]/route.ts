import { NextResponse } from "next/server";
import { readMediaFile } from "@/lib/cms/store";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

type Props = { params: Promise<{ path: string[] }> };

export async function GET(_req: Request, { params }: Props) {
  const { path: parts } = await params;
  const filename = parts?.join("/") ?? "";
  const file = await readMediaFile(filename);
  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      "Content-Type": TYPES[file.ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
