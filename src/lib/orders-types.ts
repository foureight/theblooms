export type OrderItem = {
  slug: string;
  name: string;
  sizeId: string;
  sizeLabel: string;
  price: number;
  quantity: number;
  image?: string;
};

export type OrderCustomer = {
  name: string;
  email: string;
  phone: string;
  note?: string;
};

export type OrderShipping = {
  method: "zasilkovna";
  /** Missing on older orders = pickup point. */
  delivery?: "point" | "box" | "home";
  fee: number;
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
