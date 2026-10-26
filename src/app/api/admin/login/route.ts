import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  isAdminConfigured,
  verifyPassword,
} from "@/lib/cms/store";
import {
  clientIpFromRequest,
  consumeRateLimit,
  resetRateLimit,
} from "@/lib/rate-limit";

/** 5 attempts / 15 min, then 15 min lockout per IP. */
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_BLOCK_MS = 15 * 60 * 1000;

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

  const ip = clientIpFromRequest(req);
  const limitKey = `admin-login:${ip}`;
  const limited = consumeRateLimit(
    limitKey,
    LOGIN_LIMIT,
    LOGIN_WINDOW_MS,
    LOGIN_BLOCK_MS,
  );
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: `Příliš mnoho pokusů. Zkuste to znovu za ${limited.retryAfterSec} s.`,
        code: "rate_limited",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(limited.retryAfterSec),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    password?: string;
  } | null;
  const password = body?.password ?? "";
  if (!verifyPassword(password)) {
    return NextResponse.json(
      {
        error: "Špatné heslo.",
        remaining: limited.remaining,
      },
      {
        status: 401,
        headers: {
          "X-RateLimit-Remaining": String(limited.remaining),
        },
      },
    );
  }

  resetRateLimit(limitKey);

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
