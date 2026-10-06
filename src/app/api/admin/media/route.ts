import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  deleteMedia,
  listMedia,
  saveUpload,
  verifySessionToken,
} from "@/lib/cms/store";

async function requireAdmin() {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }
  const media = await listMedia();
  return NextResponse.json({ media });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Chybí soubor." }, { status: 400 });
  }
  try {
    const saved = await saveUpload(file);
    return NextResponse.json(saved);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload selhal." },
      { status: 400 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as { name?: string } | null;
  if (!body?.name) {
    return NextResponse.json({ error: "Chybí název." }, { status: 400 });
  }
  try {
    await deleteMedia(body.name);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Smazání selhalo." },
      { status: 400 },
    );
  }
}
