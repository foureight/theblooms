import { NextResponse } from "next/server";
import { createCaptchaChallenge } from "@/lib/captcha";

export async function GET() {
  try {
    return NextResponse.json(createCaptchaChallenge());
  } catch (err) {
    console.error("[captcha]", err);
    return NextResponse.json(
      { error: "Captcha není dostupná." },
      { status: 503 },
    );
  }
}
