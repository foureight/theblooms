export type OrderItem = {
  slug: string;
  name: string;
  sizeId: string;
  sizeLabel: string;
  price: number;
  quantity: number;
  image?: string;
};

export type OrderBilling = {
  company: string;
  ico: string;
  dic?: string;
  street: string;
  city: string;
  zip: string;
};

export type OrderCustomer = {
  name: string;
  email: string;
  phone: string;
  note?: string;
  /** Present only when the customer asked for a company invoice. */
  billing?: OrderBilling;
};

export type OrderShippingPackage = {
  itemSlug: string;
  itemName: string;
  sizeId: string;
  sizeLabel: string;
  tier: "small" | "medium" | "large";
  boxLabel: string;
  dimensionsCm: { length: number; width: number; height: number };
  fee: number;
};

export type OrderPacketaPacket = {
  packetId: string;
  barcode: string;
  barcodeText?: string;
  packageIndex: number;
  createdAt: string;
};

export type OrderShipping = {
  method: "zasilkovna";
  /** Missing on older orders = pickup point. "box" kept for legacy orders. */
  delivery?: "point" | "box" | "home";
  fee: number;
  /** Human summary e.g. "2 balíky (1× menší, 1× větší)" */
  packageSummary?: string;
  packages?: OrderShippingPackage[];
  /** Created Packeta API packets (one per physical box). */
  packetaPackets?: OrderPacketaPacket[];
  packetaId?: string;
  packetaName?: string;
  packetaCity?: string;
  packetaStreet?: string;
  packetaZip?: string;
  packetaUrl?: string;
  addressStreet?: string;
  addressCity?: string;
  addressZip?: string;
};

export type OrderPayment = {
  method: "card";
  provider: "stripe" | "mock";
  status: "pending" | "paid" | "failed" | "cancelled";
  stripeSessionId?: string;
  paidAt?: string;
};

/** new = paid & ready to fulfill; pending_payment = waiting for card */
export type OrderStatus =
  | "pending_payment"
  | "new"
  | "done"
  | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: OrderCustomer;
  items: OrderItem[];
  /** Items subtotal (without shipping). */
  subtotal: number;
  shipping?: OrderShipping;
  payment?: OrderPayment;
  /** Grand total including shipping. */
  total: number;
};

export function formatOrderDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("cs-CZ", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
