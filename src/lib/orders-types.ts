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

export type OrderStatus = "new" | "done" | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: OrderCustomer;
  items: OrderItem[];
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
