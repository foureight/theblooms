import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name || !body?.email || !body?.message || !body?.type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    // Mock inbox — no external mail service configured yet
    console.info("[THE BLOOMS inquiry]", body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
