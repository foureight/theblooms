import { createHmac, timingSafeEqual } from "crypto";

const SECRET =
  process.env.CAPTCHA_SECRET?.trim() || "theblooms-dev-captcha-secret";
const TTL_MS = 10 * 60 * 1000;

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createCaptchaChallenge() {
  const a = 2 + Math.floor(Math.random() * 8);
  const b = 1 + Math.floor(Math.random() * 9);
  const exp = Date.now() + TTL_MS;
  const payload = `${a}.${b}.${exp}`;
  const token = Buffer.from(`${payload}.${sign(payload)}`).toString(
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
  const trimmed = answer.trim();
  if (!/^\d{1,3}$/.test(trimmed)) return false;

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
  const expectedSig = sign(payload);

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
  return Number(trimmed) === a + b;
}
