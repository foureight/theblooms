import { NextResponse } from "next/server";
import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/checkout";
import { getOrder, markOrderPaid, updateOrderStatus } from "@/lib/orders";

export const runtime = "nodejs";

function asString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

/** Mark mock payment paid, or verify Stripe session then mark paid. */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (!body) {
      return NextResponse.json({ error: "Neplatná data." }, { status: 400 });
    }

    const orderId = asString(body.orderId);
    const sessionId = asString(body.sessionId);
    const action = asString(body.action) || "pay";

    if (!orderId) {
      return NextResponse.json({ error: "Chybí orderId." }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Objednávka nenalezena." },
        { status: 404 },
      );
    }

    if (action === "cancel") {
      await updateOrderStatus(orderId, "cancelled");
      return NextResponse.json({ ok: true, status: "cancelled" });
    }

    if (order.payment?.status === "paid" || order.status === "new") {
      return NextResponse.json({ ok: true, status: "paid", orderId });
    }

    if (sessionId && isStripeConfigured()) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.trim());
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        return NextResponse.json(
          { error: "Platba ještě není dokončená." },
          { status: 400 },
        );
      }
      if (session.metadata?.orderId && session.metadata.orderId !== orderId) {
        return NextResponse.json(
          { error: "Nesouhlasí číslo objednávky." },
          { status: 400 },
        );
      }
      await markOrderPaid(orderId, { stripeSessionId: sessionId });
      return NextResponse.json({ ok: true, status: "paid", orderId });
    }

    // Mock card payment (local / missing Stripe keys)
    if (order.payment?.provider === "mock" || !isStripeConfigured()) {
      await markOrderPaid(orderId);
      return NextResponse.json({ ok: true, status: "paid", orderId });
    }

    return NextResponse.json(
      { error: "Platbu nelze potvrdit." },
      { status: 400 },
    );
  } catch (err) {
    console.error("[checkout/complete]", err);
    return NextResponse.json(
      { error: "Potvrzení platby selhalo." },
      { status: 500 },
    );
  }
}
