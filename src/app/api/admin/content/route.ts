import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  readCms,
  verifySessionToken,
  writeCms,
} from "@/lib/cms/store";
import { emptyCms, type CmsContent } from "@/lib/cms/types";

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
  const next: CmsContent = {
    ...emptyCms(),
    slots: body.content.slots ?? {},
    texts: body.content.texts ?? {},
    weddings: body.content.weddings ?? {},
    wreaths: body.content.wreaths ?? {},
    decorations: body.content.decorations ?? {},
    wreathOrder: Array.isArray(body.content.wreathOrder)
      ? body.content.wreathOrder.filter((s) => typeof s === "string")
      : [],
  };
  await writeCms(next);
  return NextResponse.json({ ok: true, content: next });
}
