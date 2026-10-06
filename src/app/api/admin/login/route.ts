import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  isAdminConfigured,
  verifyPassword,
} from "@/lib/cms/store";

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin není nastavený. Do prostředí doplňte ADMIN_PASSWORD.",
      },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    password?: string;
  } | null;
  const password = body?.password ?? "";
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Špatné heslo." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
