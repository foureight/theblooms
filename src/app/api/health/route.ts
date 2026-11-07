import { NextResponse } from "next/server";

/** Lightweight liveness/readiness for Zerops health + readiness checks. */
export async function GET() {
  return NextResponse.json(
    { ok: true, service: "theblooms" },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
