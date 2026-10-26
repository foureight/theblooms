import { createHmac, timingSafeEqual } from "crypto";
import { mkdir, readdir, readFile, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import { weddings as baseWeddings } from "@/data/weddings";
import {
  emptyCms,
  migrateBaseWeddingCmsKeys,
  syncCustomWeddingSlugs,
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

/** Bump ADMIN_SESSION_VERSION in Zerops to invalidate every admin cookie. */
function sessionVersion() {
  return process.env.ADMIN_SESSION_VERSION?.trim() || "1";
}

function sessionSecret(): string | null {
  const s = process.env.ADMIN_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV === "production") return null;
  return (
    process.env.CAPTCHA_SECRET?.trim() ||
    adminPassword() ||
    "theblooms-dev-admin-secret"
  );
}

/** Session lifetime — 24 hours. */
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 24;

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
    const content: CmsContent = {
      ...emptyCms(),
      ...parsed,
      slots: parsed.slots ?? {},
      texts: parsed.texts ?? {},
      pageSeo: parsed.pageSeo ?? {},
      weddings: parsed.weddings ?? {},
      wreaths: parsed.wreaths ?? {},
      decorations: parsed.decorations ?? {},
      workshops: parsed.workshops ?? {},
      flowers: parsed.flowers ?? {},
      weddingPriceList: parsed.weddingPriceList ?? {},
      wreathOrder: parsed.wreathOrder ?? [],
      weddingOrder: parsed.weddingOrder ?? [],
      decorationOrder: parsed.decorationOrder ?? [],
      flowerOrder: parsed.flowerOrder ?? [],
      faqs: parsed.faqs ?? {},
    };
    // Couple-name keys → wedding-name slugs; custom titles → slugify
    const baseSlugs = new Set(baseWeddings.map((w) => w.slug));
    const migrated = migrateBaseWeddingCmsKeys(content, baseWeddings);
    const synced = syncCustomWeddingSlugs(migrated, baseSlugs);
    if (
      JSON.stringify(synced.weddings) !== JSON.stringify(content.weddings) ||
      JSON.stringify(synced.weddingOrder) !==
        JSON.stringify(content.weddingOrder)
    ) {
      await writeCms(synced);
      return synced;
    }
    return content;
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

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSessionToken() {
  const secret = sessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SECRET is required in production");
  }
  const exp = Date.now() + ADMIN_SESSION_MAX_AGE_SEC * 1000;
  const payload = `ok.${exp}.${sessionVersion()}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const secret = sessionSecret();
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 4) return false;
  const [ok, expStr, ver, sig] = parts;
  if (ok !== "ok") return false;
  if (ver !== sessionVersion()) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `${ok}.${expStr}.${ver}`;
  const expected = sign(payload, secret);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyPassword(password: string) {
  const expected = adminPassword();
  const secret = sessionSecret();
  if (!expected || !secret) return false;
  const a = createHmac("sha256", secret).update(password).digest();
  const b = createHmac("sha256", secret).update(expected).digest();
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
