import { NextResponse } from "next/server";
import {
  addressFieldErrors,
  addressValidationError,
  type DeliveryAddress,
} from "@/lib/checkout";
import {
  packetaConfig,
  validateHomeAddressWithPacketa,
} from "@/lib/packeta";
import {
  clientIpFromRequest,
  consumeRateLimit,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

function asString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Validate home-delivery address: local CZ format first,
 * then Packeta packetAttributesValid when API password is set.
 */
export async function POST(req: Request) {
  const ip = clientIpFromRequest(req);
  const limited = consumeRateLimit(
    `packeta-validate:${ip}`,
    20,
    15 * 60 * 1000,
    5 * 60 * 1000,
  );
  if (!limited.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Příliš mnoho pokusů. Zkuste to za ${limited.retryAfterSec} s.`,
      },
      { status: 429 },
    );
  }

  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json(
      { ok: false, error: "Neplatná data." },
      { status: 400 },
    );
  }

  const address: DeliveryAddress = {
    street: asString(body.street),
    city: asString(body.city),
    zip: asString(body.zip),
  };

  const localErrors = addressFieldErrors(address);
  const localMsg = addressValidationError(address);
  if (localMsg) {
    return NextResponse.json({
      ok: false,
      viaPacketa: false,
      error: localMsg,
      fields: localErrors,
    });
  }

  if (!packetaConfig().configured) {
    // Format OK; Packeta live check unavailable in this environment.
    return NextResponse.json({
      ok: true,
      viaPacketa: false,
      warning:
        "Adresa má správný formát. Živé ověření Zásilkovny není nastavené (chybí API heslo).",
    });
  }

  const result = await validateHomeAddressWithPacketa({
    ...address,
    name: asString(body.firstName) || undefined,
    surname: asString(body.lastName) || undefined,
    email: asString(body.email) || undefined,
    phone: asString(body.phone) || undefined,
  });

  if (!result.ok) {
    const fields: Record<string, string> = {};
    if (result.field && result.field !== "general" && result.error) {
      fields[result.field] = result.error;
    }
    return NextResponse.json({
      ok: false,
      viaPacketa: result.viaPacketa,
      error: result.error || "Adresu Zásilkovna neověřila.",
      fields,
    });
  }

  return NextResponse.json({
    ok: true,
    viaPacketa: true,
  });
}
