import { NextResponse } from "next/server";
import { createOrder, type OrderItem } from "@/lib/orders";

function asString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function parseItems(raw: unknown): OrderItem[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const items: OrderItem[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") return null;
    const r = row as Record<string, unknown>;
    const slug = asString(r.slug);
    const name = asString(r.name);
    const sizeId = asString(r.sizeId) || "m";
    const sizeLabel = asString(r.sizeLabel);
    const price = typeof r.price === "number" ? r.price : Number(r.price);
    const quantity =
      typeof r.quantity === "number" ? r.quantity : Number(r.quantity);
    if (!slug || !name || !Number.isFinite(price) || price < 0) return null;
    if (!Number.isFinite(quantity) || quantity < 1) return null;
    items.push({
      slug,
      name,
      sizeId,
      sizeLabel,
      price: Math.round(price),
      quantity: Math.floor(quantity),
      image: asString(r.image) || undefined,
    });
  }
  return items;
}

/** Public checkout — saves order for admin. */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (!body) {
      return NextResponse.json({ error: "Neplatná data." }, { status: 400 });
    }

    const name = asString(body.name);
    const email = asString(body.email);
    const phone = asString(body.phone);
    const note = asString(body.note);
    const items = parseItems(body.items);

    if (!name || !email || !items) {
      return NextResponse.json(
        { error: "Vyplňte jméno, e-mail a položky košíku." },
        { status: 400 },
      );
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Neplatný e-mail." }, { status: 400 });
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await createOrder({
      customer: { name, email, phone, note: note || undefined },
      items,
      subtotal,
      total: subtotal,
      status: "new",
    });

    console.info("[THE BLOOMS order]", order.id, order.customer.email, subtotal);
    return NextResponse.json({ ok: true, order });
  } catch {
    return NextResponse.json(
      { error: "Objednávku se nepodařilo uložit." },
      { status: 500 },
    );
  }
}
