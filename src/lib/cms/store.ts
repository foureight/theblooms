import { createHmac, timingSafeEqual } from "crypto";
import { mkdir, readdir, readFile, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  emptyCms,
  type CmsContent,
  type MediaItem,
} from "@/lib/cms/types";
import { fixCzechOrphans } from "@/lib/typography";

const COOKIE = "blooms_admin";
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function uploadsRoot() {
  return (
    process.env.UPLOADS_DIR?.trim() ||
    path.join(process.cwd(), "uploads")
  );
}

function mediaDir() {
  return path.join(uploadsRoot(), "media");
}

function contentPath() {
  return path.join(uploadsRoot(), "cms.json");
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

function sessionSecret() {
  return (
    process.env.ADMIN_SECRET?.trim() ||
    process.env.CAPTCHA_SECRET?.trim() ||
    adminPassword() ||
    "theblooms-dev-admin-secret"
  );
}

export function isAdminConfigured() {
  return Boolean(adminPassword());
}

export async function ensureUploads() {
  await mkdir(mediaDir(), { recursive: true });
}

export async function readCms(): Promise<CmsContent> {
  await ensureUploads();
  try {
    const raw = await readFile(contentPath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<CmsContent>;
    return {
      ...emptyCms(),
      ...parsed,
      slots: parsed.slots ?? {},
      texts: parsed.texts ?? {},
      weddings: parsed.weddings ?? {},
      wreaths: parsed.wreaths ?? {},
      decorations: parsed.decorations ?? {},
      workshops: parsed.workshops ?? {},
      flowers: parsed.flowers ?? {},
      wreathOrder: parsed.wreathOrder ?? [],
    };
  } catch {
    return emptyCms();
  }
}

export async function writeCms(content: CmsContent) {
  await ensureUploads();
  await writeFile(contentPath(), JSON.stringify(content, null, 2), "utf8");
}

export function mediaUrl(filename: string) {
  return `/media/${encodeURIComponent(filename)}`;
}

export async function listMedia(): Promise<MediaItem[]> {
  await ensureUploads();
  const names = await readdir(mediaDir());
  const items: MediaItem[] = [];
  for (const name of names) {
    const ext = path.extname(name).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) continue;
    const full = path.join(mediaDir(), name);
    const s = await stat(full);
    if (!s.isFile()) continue;
    items.push({
      name,
      url: mediaUrl(name),
      size: s.size,
      updatedAt: s.mtime.toISOString(),
    });
  }
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveUpload(file: File) {
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error("Povolené formáty: JPG, PNG, WEBP, GIF.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Soubor je příliš velký (max 8 MB).");
  }
  await ensureUploads();
  const base = file.name
    .replace(ext, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const name = `${base || "foto"}-${Date.now()}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(mediaDir(), name), buf);
  return { name, url: mediaUrl(name) };
}

export async function deleteMedia(filename: string) {
  const safe = path.basename(filename);
  if (safe !== filename || safe.includes("..")) {
    throw new Error("Neplatný název souboru.");
  }
  await unlink(path.join(mediaDir(), safe));
}

export async function readMediaFile(filename: string) {
  const safe = path.basename(filename);
  if (safe !== filename || safe.includes("..")) return null;
  const full = path.join(mediaDir(), safe);
  try {
    const data = await readFile(full);
    return { data, ext: path.extname(safe).toLowerCase() };
  } catch {
    return null;
  }
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

export function createSessionToken() {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 14; // 14 dní
  const payload = `ok.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ok, expStr, sig] = parts;
  if (ok !== "ok") return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `${ok}.${expStr}`;
  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyPassword(password: string) {
  const expected = adminPassword();
  if (!expected) return false;
  const a = createHmac("sha256", sessionSecret()).update(password).digest();
  const b = createHmac("sha256", sessionSecret()).update(expected).digest();
  return timingSafeEqual(a, b);
}

export { COOKIE as ADMIN_COOKIE };

export function resolveSlot(
  cms: CmsContent,
  id: string,
  fallback: string,
) {
  return cms.slots[id]?.trim() || fallback;
}

export function resolveText(cms: CmsContent, id: string, fallback: string) {
  const v = cms.texts[id];
  if (typeof v === "string" && v.trim()) return fixCzechOrphans(v);
  return fixCzechOrphans(fallback);
}
