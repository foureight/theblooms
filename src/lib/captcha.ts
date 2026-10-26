import { createHmac, timingSafeEqual } from "crypto";

const TTL_MS = 10 * 60 * 1000;

/** Used captcha tokens — one successful verify consumes the token. */
const usedTokens = new Map<string, number>();

function captchaSecret(): string | null {
  const s = process.env.CAPTCHA_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV === "production") return null;
  return "theblooms-dev-captcha-secret";
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function pruneUsedTokens(now = Date.now()) {
  for (const [token, exp] of usedTokens) {
    if (exp <= now) usedTokens.delete(token);
  }
}

export function createCaptchaChallenge() {
  const secret = captchaSecret();
  if (!secret) {
    throw new Error("CAPTCHA_SECRET is required in production");
  }
  const a = 2 + Math.floor(Math.random() * 8);
  const b = 1 + Math.floor(Math.random() * 9);
  const exp = Date.now() + TTL_MS;
  const payload = `${a}.${b}.${exp}`;
  const token = Buffer.from(`${payload}.${sign(payload, secret)}`).toString(
    "base64url",
  );
  return {
    token,
    question: `Kolik je ${a}\u00a0+\u00a0${b}?`,
  };
}

export function verifyCaptchaChallenge(
  token: unknown,
  answer: unknown,
): boolean {
  if (typeof token !== "string" || typeof answer !== "string") return false;
  const secret = captchaSecret();
  if (!secret) return false;

  const trimmed = answer.trim();
  if (!/^\d{1,3}$/.test(trimmed)) return false;

  pruneUsedTokens();
  if (usedTokens.has(token)) return false;

  let decoded: string;
  try {
    decoded = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const parts = decoded.split(".");
  if (parts.length !== 4) return false;
  const [aRaw, bRaw, expRaw, sig] = parts;
  const payload = `${aRaw}.${bRaw}.${expRaw}`;
  const expectedSig = sign(payload, secret);

  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expectedSig, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }

  const a = Number(aRaw);
  const b = Number(bRaw);
  const exp = Number(expRaw);
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(exp)) {
    return false;
  }
  if (Date.now() > exp) return false;
  if (Number(trimmed) !== a + b) return false;

  // One-time use until the challenge would have expired.
  usedTokens.set(token, exp);
  return true;
}
