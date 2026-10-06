import { NextResponse } from "next/server";
import { verifyCaptchaChallenge } from "@/lib/captcha";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name || !body?.email || !body?.message || !body?.type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Honeypot — bots that fill hidden fields are rejected quietly
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    if (!verifyCaptchaChallenge(body.captchaToken, body.captchaAnswer)) {
      return NextResponse.json(
        { error: "Invalid captcha", code: "captcha" },
        { status: 400 },
      );
    }

    // Mock inbox — no external mail service configured yet
    const { captchaToken: _t, captchaAnswer: _a, website: _w, ...inquiry } =
      body;
    console.info("[THE BLOOMS inquiry]", inquiry);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
