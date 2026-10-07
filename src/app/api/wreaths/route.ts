import { NextResponse } from "next/server";
import { getCmsContent, mergeWreaths } from "@/lib/cms/content";

/** Public catalog — admin/CMS overrides always win over code defaults. */
export async function GET() {
  const cms = await getCmsContent();
  const wreaths = mergeWreaths(cms);
  return NextResponse.json(
    { wreaths },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
