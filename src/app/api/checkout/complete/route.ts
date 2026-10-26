import { NextResponse } from "next/server";
import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/checkout";
import { getOrder, markOrderPaid, updateOrderStatus } from "@/lib/orders";

export const runtime = "nodejs";

function asString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Confirm or cancel a checkout.
 * Paid status for Stripe orders is set by webhook; this endpoint may
 * also verify a Checkout Session as a backup. Mock pay is locally only.
 */
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
      if (order.status !== "pending_payment") {
        return NextResponse.json(
          { error: "Objednávku nelze zrušit." },
          { status: 400 },
        );
      }

      // Stripe cancel: require session id matching the order's session.
      if (order.payment?.provider === "stripe") {
        const expected = order.payment.stripeSessionId;
        if (!sessionId || !expected || sessionId !== expected) {
          return NextResponse.json(
            { error: "Zrušení platby nelze ověřit." },
            { status: 403 },
          );
        }
      } else if (
        order.payment?.provider === "mock" &&
        process.env.NODE_ENV === "production"
      ) {
        return NextResponse.json(
          { error: "Objednávku nelze zrušit." },
          { status: 403 },
        );
      }

      await updateOrderStatus(orderId, "cancelled");
      return NextResponse.json({ ok: true, status: "cancelled" });
    }

    if (order.payment?.status === "paid" || order.status === "new") {
      return NextResponse.json({ ok: true, status: "paid", orderId });
    }

    if (order.status !== "pending_payment") {
      return NextResponse.json(
        { error: "Platbu nelze potvrdit." },
        { status: 400 },
      );
    }

    if (isStripeConfigured() && order.payment?.provider === "stripe") {
      if (!sessionId) {
        // Webhook may still be in flight — report unpaid, do not mark paid.
        return NextResponse.json(
          { error: "Platba ještě není dokončená.", code: "pending" },
          { status: 400 },
        );
      }

      const expectedSession = order.payment.stripeSessionId;
      if (!expectedSession || sessionId !== expectedSession) {
        return NextResponse.json(
          { error: "Nesouhlasí platební relace." },
          { status: 403 },
        );
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.trim());
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        return NextResponse.json(
          { error: "Platba ještě není dokončená." },
          { status: 400 },
        );
      }
      if (!session.metadata?.orderId || session.metadata.orderId !== orderId) {
        return NextResponse.json(
          { error: "Nesouhlasí číslo objednávky." },
          { status: 403 },
        );
      }

      await markOrderPaid(orderId, { stripeSessionId: sessionId });
      return NextResponse.json({ ok: true, status: "paid", orderId });
    }

    // Mock card payment — development / local only.
    if (
      order.payment?.provider === "mock" &&
      process.env.NODE_ENV !== "production"
    ) {
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
