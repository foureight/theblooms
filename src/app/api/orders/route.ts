import { NextResponse } from "next/server";

/**
 * Legacy public order endpoint — disabled.
 * Orders must go through /api/checkout (captcha, shipping, payment).
 * Creating status "new" here allowed unpaid spam into admin.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Tento endpoint je vypnutý. Objednávky probíhají přes /api/checkout.",
      code: "gone",
    },
    { status: 410 },
  );
}

export async function GET() {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}
