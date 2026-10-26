/**
 * Packeta (Zásilkovna) REST API — create packets + PDF labels.
 * Docs: https://docs.packeta.com/
 *
 * Env:
 *   PACKETA_API_PASSWORD — API password from Packeta client section
 *   PACKETA_SENDER_ID — numeric sender id (e.g. 578009)
 *   PACKETA_ESHOP — sender indication / eshop name (e.g. theblooms)
 *   PACKETA_HOME_CARRIER_ID — home delivery carrier addressId (CZ default 106)
 */

import type { Order } from "@/lib/orders-types";
import type { ShippingPackage } from "@/lib/shipping";

const REST_URL = "https://www.zasilkovna.cz/api/rest";

/** Packeta CZ home delivery carrier id (addressId). */
const DEFAULT_HOME_CARRIER_ID = 106;

export type PacketaPacketResult = {
  packetId: string;
  barcode: string;
  barcodeText?: string;
  packageIndex: number;
  createdAt: string;
};

export function packetaConfig() {
  const apiPassword = process.env.PACKETA_API_PASSWORD?.trim() || "";
  const senderId = process.env.PACKETA_SENDER_ID?.trim() || "578009";
  const eshop =
    process.env.PACKETA_ESHOP?.trim() ||
    process.env.PACKETA_SENDER_INDICATION?.trim() ||
    "theblooms";
  const homeCarrierId = Number(
    process.env.PACKETA_HOME_CARRIER_ID?.trim() || DEFAULT_HOME_CARRIER_ID,
  );
  return {
    apiPassword,
    senderId,
    eshop,
    homeCarrierId: Number.isFinite(homeCarrierId)
      ? homeCarrierId
      : DEFAULT_HOME_CARRIER_ID,
    configured: Boolean(apiPassword),
  };
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function tag(name: string, value: string | number | undefined | null) {
  if (value === undefined || value === null || value === "") return "";
  return `<${name}>${escapeXml(String(value))}</${name}>`;
}

function xmlText(xml: string, tagName: string): string {
  const re = new RegExp(
    `<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`,
    "i",
  );
  const m = xml.match(re);
  return m?.[1]?.trim() ?? "";
}

function splitName(full: string): { name: string; surname: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { name: "Zákazník", surname: "THE BLOOMS" };
  if (parts.length === 1) return { name: parts[0]!, surname: parts[0]! };
  return {
    name: parts[0]!,
    surname: parts.slice(1).join(" "),
  };
}

/** Prefer "Ulice 12/3" → street + houseNumber for Packeta HD. */
export function splitStreet(streetRaw: string): {
  street: string;
  houseNumber: string;
} {
  const street = streetRaw.trim();
  const m = street.match(/^(.+?)\s+(\d[\w\/\-]*)$/u);
  if (m) return { street: m[1]!.trim(), houseNumber: m[2]! };
  return { street, houseNumber: "1" };
}

async function postRest(bodyXml: string): Promise<string> {
  const res = await fetch(REST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/xml; charset=utf-8" },
    body: bodyXml,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Packeta HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  const status = xmlText(text, "status").toLowerCase();
  if (status && status !== "ok") {
    const fault =
      xmlText(text, "fault") ||
      xmlText(text, "string") ||
      xmlText(text, "message") ||
      text.slice(0, 300);
    throw new Error(fault || "Packeta API error");
  }
  return text;
}

function packageWeightKg(pkg: ShippingPackage) {
  // Floristry boxes are light; Packeta needs a positive weight.
  if (pkg.tier === "large") return 3;
  if (pkg.tier === "medium") return 2;
  return 1.5;
}

function packageValue(order: Order, pkg: ShippingPackage, index: number) {
  const matching = order.items.filter(
    (i) => i.slug === pkg.itemSlug && i.sizeId === pkg.sizeId,
  );
  if (matching[0]) return matching[0].price;
  // Fallback: split order value across packages
  const n = Math.max(1, order.shipping?.packages?.length ?? 1);
  return Math.max(1, Math.round(order.subtotal / n));
}

export async function createPacketForOrderPackage(
  order: Order,
  pkg: ShippingPackage,
  packageIndex: number,
): Promise<PacketaPacketResult> {
  const cfg = packetaConfig();
  if (!cfg.configured) {
    throw new Error(
      "Chybí PACKETA_API_PASSWORD — doplňte API heslo Zásilkovny v prostředí.",
    );
  }
  if (!order.customer.phone?.trim()) {
    throw new Error("U objednávky chybí telefon zákazníka.");
  }

  const { name, surname } = splitName(order.customer.name);
  const delivery = order.shipping?.delivery === "home" ? "home" : "point";
  const number = `${order.id}-${packageIndex + 1}`;
  const value = packageValue(order, pkg, packageIndex);
  const weight = packageWeightKg(pkg);

  let destinationXml = "";
  if (delivery === "home") {
    const streetRaw = order.shipping?.addressStreet?.trim() || "";
    const city = order.shipping?.addressCity?.trim() || "";
    const zip = (order.shipping?.addressZip || "").replace(/\s/g, "");
    if (!streetRaw || !city || !zip) {
      return Promise.reject(new Error("Chybí adresa pro doručení domů."));
    }
    const { street, houseNumber } = splitStreet(streetRaw);
    destinationXml = [
      tag("addressId", cfg.homeCarrierId),
      tag("street", street),
      tag("houseNumber", houseNumber),
      tag("city", city),
      tag("zip", zip),
    ].join("");
  } else {
    const addressId = order.shipping?.packetaId;
    if (!addressId) {
      throw new Error("Chybí ID výdejního místa Zásilkovny.");
    }
    destinationXml = tag("addressId", addressId);
  }

  const attrs = [
    tag("number", number),
    tag("name", name),
    tag("surname", surname),
    tag("email", order.customer.email),
    tag("phone", order.customer.phone),
    destinationXml,
    tag("value", value),
    tag("currency", "CZK"),
    tag("weight", weight),
    tag("eshop", cfg.eshop),
    tag("adultContent", 0),
    order.customer.note ? tag("note", order.customer.note.slice(0, 128)) : "",
  ].join("");

  const xml = `<createPacket><apiPassword>${escapeXml(cfg.apiPassword)}</apiPassword><packetAttributes>${attrs}</packetAttributes></createPacket>`;
  const response = await postRest(xml);
  const packetId = xmlText(response, "id");
  const barcode = xmlText(response, "barcode");
  const barcodeText = xmlText(response, "barcodeText");
  if (!packetId) {
    throw new Error(
      `Packeta nevrátila ID zásilky: ${response.slice(0, 400)}`,
    );
  }
  return {
    packetId,
    barcode: barcode || packetId,
    barcodeText: barcodeText || undefined,
    packageIndex,
    createdAt: new Date().toISOString(),
  };
}

export async function createAllPacketsForOrder(
  order: Order,
): Promise<PacketaPacketResult[]> {
  const packages = order.shipping?.packages;
  if (!packages || packages.length === 0) {
    throw new Error(
      "Objednávka nemá rozpis balíků — nelze vytvořit zásilky.",
    );
  }
  const existing = new Set(
    (order.shipping?.packetaPackets ?? []).map((p) => p.packageIndex),
  );
  const results: PacketaPacketResult[] = [
    ...(order.shipping?.packetaPackets ?? []).map((p) => ({
      packetId: p.packetId,
      barcode: p.barcode,
      barcodeText: p.barcodeText,
      packageIndex: p.packageIndex,
      createdAt: p.createdAt,
    })),
  ];
  for (let i = 0; i < packages.length; i++) {
    if (existing.has(i)) continue;
    const created = await createPacketForOrderPackage(order, packages[i]!, i);
    results.push(created);
  }
  return results.sort((a, b) => a.packageIndex - b.packageIndex);
}

export async function fetchPacketLabelPdf(
  packetIds: string[],
): Promise<Buffer> {
  const cfg = packetaConfig();
  if (!cfg.configured) {
    throw new Error("Chybí PACKETA_API_PASSWORD.");
  }
  if (packetIds.length === 0) {
    throw new Error("Žádné zásilky k tisku.");
  }
  const idsXml = packetIds.map((id) => tag("id", id)).join("");
  const xml =
    packetIds.length === 1
      ? `<packetLabelPdf><apiPassword>${escapeXml(cfg.apiPassword)}</apiPassword>${tag("packetId", packetIds[0]!)}<format>A6 on A6</format><offset>0</offset></packetLabelPdf>`
      : `<packetsLabelsPdf><apiPassword>${escapeXml(cfg.apiPassword)}</apiPassword><packetIds>${idsXml}</packetIds><format>A6 on A6</format><offset>0</offset></packetsLabelsPdf>`;
  const response = await postRest(xml);
  const b64 = xmlText(response, "result");
  if (!b64) {
    throw new Error("Packeta nevrátila PDF štítek.");
  }
  return Buffer.from(b64, "base64");
}
