import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { weddings as baseWeddings } from "@/data/weddings";
import {
  ADMIN_COOKIE,
  readCms,
  verifySessionToken,
  writeCms,
} from "@/lib/cms/store";
import {
  emptyCms,
  syncCustomWeddingSlugs,
  type CmsContent,
  type CmsPriceRow,
  type CmsWeddingPriceList,
} from "@/lib/cms/types";

function sanitizePriceRows(rows: unknown): CmsPriceRow[] | undefined {
  if (!Array.isArray(rows)) return undefined;
  const cleaned = rows
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const r = row as { item?: unknown; price?: unknown };
      const item = typeof r.item === "string" ? r.item.trim() : "";
      const price = typeof r.price === "string" ? r.price.trim() : "";
      if (!item && !price) return null;
      return { item, price };
    })
    .filter((r): r is CmsPriceRow => Boolean(r));
  return cleaned;
}

function sanitizeWeddingPriceList(raw: unknown): CmsWeddingPriceList {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as CmsWeddingPriceList;
  return {
    flowers: sanitizePriceRows(o.flowers),
    decor: sanitizePriceRows(o.decor),
  };
}

async function requireAdmin() {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }
  const content = await readCms();
  return NextResponse.json({ content });
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as {
    content?: CmsContent;
  } | null;
  if (!body?.content || typeof body.content !== "object") {
    return NextResponse.json({ error: "Neplatná data." }, { status: 400 });
  }
  const baseWeddingSlugs = new Set(baseWeddings.map((w) => w.slug));
  const next = syncCustomWeddingSlugs(
    {
      ...emptyCms(),
      slots: body.content.slots ?? {},
      texts: body.content.texts ?? {},
      pageSeo: body.content.pageSeo ?? {},
      weddings: body.content.weddings ?? {},
      wreaths: body.content.wreaths ?? {},
      decorations: body.content.decorations ?? {},
      workshops: body.content.workshops ?? {},
      flowers: body.content.flowers ?? {},
      weddingPriceList: sanitizeWeddingPriceList(body.content.weddingPriceList),
      wreathOrder: Array.isArray(body.content.wreathOrder)
        ? body.content.wreathOrder.filter((s) => typeof s === "string")
        : [],
      weddingOrder: Array.isArray(body.content.weddingOrder)
        ? body.content.weddingOrder.filter((s) => typeof s === "string")
        : [],
      flowerOrder: Array.isArray(body.content.flowerOrder)
        ? body.content.flowerOrder.filter((s) => typeof s === "string")
        : [],
    },
    baseWeddingSlugs,
  );
  await writeCms(next);
  return NextResponse.json({ ok: true, content: next });
}
