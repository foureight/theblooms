import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  verifySessionToken,
} from "@/lib/cms/store";
import {
  readOrders,
  updateOrderStatus,
  type OrderStatus,
} from "@/lib/orders";

async function requireAdmin() {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }
  const orders = await readOrders();
  return NextResponse.json(
    { orders },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as {
    id?: string;
    status?: OrderStatus;
  } | null;
  const id = body?.id?.trim();
  const status = body?.status;
  if (
    !id ||
    (status !== "new" && status !== "done" && status !== "cancelled")
  ) {
    return NextResponse.json({ error: "Neplatná data." }, { status: 400 });
  }
  const order = await updateOrderStatus(id, status);
  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, order });
}
