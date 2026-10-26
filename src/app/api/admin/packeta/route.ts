import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/cms/store";
import { getOrder, updateOrderShipping } from "@/lib/orders";
import {
  createAllPacketsForOrder,
  fetchPacketLabelPdf,
  packetaConfig,
} from "@/lib/packeta";

export const runtime = "nodejs";

async function requireAdmin() {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
}

/** Create Packeta packets for an order (all missing packages). */
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }
  if (!packetaConfig().configured) {
    return NextResponse.json(
      {
        error:
          "Chybí PACKETA_API_PASSWORD. Doplňte API heslo Zásilkovny v prostředí webu.",
      },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    orderId?: string;
  } | null;
  const orderId = body?.orderId?.trim();
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
  if (!order.shipping) {
    return NextResponse.json(
      { error: "Objednávka nemá dopravu Zásilkovnou." },
      { status: 400 },
    );
  }
  if (order.payment?.status !== "paid" && order.status === "pending_payment") {
    return NextResponse.json(
      { error: "Objednávka ještě není zaplacená." },
      { status: 400 },
    );
  }

  try {
    const packets = await createAllPacketsForOrder(order);
    const shipping = {
      ...order.shipping,
      packetaPackets: packets,
    };
    const updated = await updateOrderShipping(orderId, shipping);
    return NextResponse.json({
      ok: true,
      order: updated,
      packets,
    });
  } catch (err) {
    console.error("[packeta create]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Zásilky se nepodařilo vytvořit.",
      },
      { status: 502 },
    );
  }
}

/** Download Packeta label PDF for an order. */
export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }
  if (!packetaConfig().configured) {
    return NextResponse.json(
      { error: "Chybí PACKETA_API_PASSWORD." },
      { status: 503 },
    );
  }

  const orderId = new URL(req.url).searchParams.get("orderId")?.trim();
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
  const packetIds = (order.shipping?.packetaPackets ?? []).map(
    (p) => p.packetId,
  );
  if (packetIds.length === 0) {
    return NextResponse.json(
      {
        error:
          "Nejdřív vytvořte zásilky v Zásilkovně (tlačítko Vytvořit zásilky).",
      },
      { status: 400 },
    );
  }

  try {
    const pdf = await fetchPacketLabelPdf(packetIds);
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="zasilkovna-${orderId}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[packeta label]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Štítek se nepodařilo stáhnout.",
      },
      { status: 502 },
    );
  }
}
