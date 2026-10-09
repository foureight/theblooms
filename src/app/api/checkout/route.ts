import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  DELIVERY_OPTIONS,
  deliveryFee,
  formatAddress,
  isDeliveryType,
  isStripeConfigured,
  type DeliveryAddress,
  type PacketaPoint,
} from "@/lib/checkout";
import {
  createOrder,
  updateOrderPayment,
  type OrderItem,
  type OrderShipping,
} from "@/lib/orders";
import { siteUrl } from "@/lib/seo";

export const runtime = "nodejs";

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

function parsePacketa(raw: unknown): PacketaPoint | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = asString(r.id);
  const name = asString(r.name);
  if (!id || !name) return null;
  return {
    id,
    name,
    city: asString(r.city),
    street: asString(r.street),
    zip: asString(r.zip),
    url: asString(r.url) || undefined,
  };
}

function parseAddress(raw: unknown): DeliveryAddress | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const street = asString(r.street);
  const city = asString(r.city);
  const zip = asString(r.zip);
  if (!street || !city || !zip) return null;
  return { street, city, zip };
}

function originFromRequest(req: Request) {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (env && !/theblooms\.cz$/i.test(new URL(env).hostname)) return env;
  try {
    return new URL(req.url).origin;
  } catch {
    return siteUrl;
  }
}

/** Create order + Stripe Checkout (or mock payment URL). */
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
    const delivery = isDeliveryType(body.delivery) ? body.delivery : "point";
    const packeta = delivery === "home" ? null : parsePacketa(body.packeta);
    const address = delivery === "home" ? parseAddress(body.address) : null;

    if (!name || !email || !items) {
      return NextResponse.json(
        { error: "Vyplňte jméno, e-mail a položky košíku." },
        { status: 400 },
      );
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Neplatný e-mail." }, { status: 400 });
    }
    if (delivery === "home" && !address) {
      return NextResponse.json(
        { error: "Vyplňte adresu pro doručení." },
        { status: 400 },
      );
    }
    if (delivery === "home" && !phone) {
      return NextResponse.json(
        { error: "Pro doručení na adresu vyplňte telefon pro kurýra." },
        { status: 400 },
      );
    }
    if (delivery !== "home" && !packeta) {
      return NextResponse.json(
        {
          error:
            delivery === "box"
              ? "Vyberte Z-BOX Zásilkovny."
              : "Vyberte výdejní místo Zásilkovny.",
        },
        { status: 400 },
      );
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = deliveryFee(delivery);
    const total = subtotal + shippingFee;
    const useStripe = isStripeConfigured();

    const shipping: OrderShipping = address
      ? {
          method: "zasilkovna",
          delivery,
          fee: shippingFee,
          addressStreet: address.street,
          addressCity: address.city,
          addressZip: address.zip,
        }
      : {
          method: "zasilkovna",
          delivery,
          fee: shippingFee,
          packetaId: packeta!.id,
          packetaName: packeta!.name,
          packetaCity: packeta!.city,
          packetaStreet: packeta!.street,
          packetaZip: packeta!.zip,
          packetaUrl: packeta!.url,
        };
    const shippingLine = address
      ? `${DELIVERY_OPTIONS.home.label} — ${formatAddress(address)}`
      : `${DELIVERY_OPTIONS[delivery].label} — ${packeta!.name}`;

    const order = await createOrder({
      customer: { name, email, phone, note: note || undefined },
      items,
      subtotal,
      total,
      shipping,
      payment: {
        method: "card",
        provider: useStripe ? "stripe" : "mock",
        status: "pending",
      },
      status: "pending_payment",
    });

    const origin = originFromRequest(req);

    if (useStripe) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.trim());
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        locale: "cs",
        line_items: [
          ...items.map((item) => ({
            quantity: item.quantity,
            price_data: {
              currency: "czk",
              unit_amount: item.price * 100,
              product_data: {
                name: item.sizeLabel
                  ? `${item.name} (${item.sizeLabel})`
                  : item.name,
              },
            },
          })),
          {
            quantity: 1,
            price_data: {
              currency: "czk",
              unit_amount: shippingFee * 100,
              product_data: {
                name: shippingLine,
              },
            },
          },
        ],
        metadata: {
          orderId: order.id,
        },
        success_url: `${origin}/pokladna/uspech?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pokladna/zruseno?orderId=${order.id}`,
      });

      await updateOrderPayment(order.id, {
        method: "card",
        provider: "stripe",
        status: "pending",
        stripeSessionId: session.id,
      });

      return NextResponse.json({
        ok: true,
        orderId: order.id,
        provider: "stripe",
        url: session.url,
      });
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      provider: "mock",
      url: `${origin}/pokladna/mock?orderId=${order.id}`,
    });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json(
      { error: "Checkout se nepodařilo spustit." },
      { status: 500 },
    );
  }
}
