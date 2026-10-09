import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type {
  Order,
  OrderCustomer,
  OrderItem,
  OrderPayment,
  OrderShipping,
  OrderStatus,
} from "@/lib/orders-types";

export type {
  Order,
  OrderBilling,
  OrderCustomer,
  OrderItem,
  OrderPayment,
  OrderShipping,
  OrderStatus,
} from "@/lib/orders-types";
export { formatOrderDate } from "@/lib/orders-types";

function uploadsRoot() {
  return (
    process.env.UPLOADS_DIR?.trim() ||
    path.join(process.cwd(), "uploads")
  );
}

function ordersPath() {
  return path.join(uploadsRoot(), "orders.json");
}

async function ensureOrdersFile() {
  await mkdir(uploadsRoot(), { recursive: true });
}

function normalizeOrder(raw: Order): Order {
  const subtotal =
    typeof raw.subtotal === "number"
      ? raw.subtotal
      : raw.items.reduce((s, i) => s + i.price * i.quantity, 0);
  return {
    ...raw,
    subtotal,
    total: typeof raw.total === "number" ? raw.total : subtotal,
    status: raw.status || "new",
  };
}

export async function readOrders(): Promise<Order[]> {
  await ensureOrdersFile();
  try {
    const raw = await readFile(ordersPath(), "utf8");
    const parsed = JSON.parse(raw) as { orders?: Order[] } | Order[];
    const list = Array.isArray(parsed) ? parsed : (parsed.orders ?? []);
    return list
      .filter((o) => o && typeof o.id === "string")
      .map(normalizeOrder)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]) {
  await ensureOrdersFile();
  await writeFile(
    ordersPath(),
    JSON.stringify({ orders }, null, 2),
    "utf8",
  );
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = await readOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function createOrder(input: {
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  total: number;
  shipping?: OrderShipping;
  payment?: OrderPayment;
  status?: OrderStatus;
}): Promise<Order> {
  const orders = await readOrders();
  const order: Order = {
    id: randomUUID().slice(0, 8),
    createdAt: new Date().toISOString(),
    status: input.status ?? "new",
    customer: input.customer,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    payment: input.payment,
    total: input.total,
  };
  orders.unshift(order);
  await writeOrders(orders);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  const orders = await readOrders();
  const i = orders.findIndex((o) => o.id === id);
  if (i < 0) return null;
  const current = orders[i]!;
  const next = { ...current, status };
  orders[i] = next;
  await writeOrders(orders);
  return next;
}

export async function markOrderPaid(
  id: string,
  opts?: { stripeSessionId?: string },
): Promise<Order | null> {
  const orders = await readOrders();
  const i = orders.findIndex((o) => o.id === id);
  if (i < 0) return null;
  const current = orders[i]!;
  const next: Order = {
    ...current,
    status: current.status === "cancelled" ? current.status : "new",
    payment: {
      method: "card",
      provider: current.payment?.provider ?? "mock",
      status: "paid",
      stripeSessionId:
        opts?.stripeSessionId || current.payment?.stripeSessionId,
      paidAt: new Date().toISOString(),
    },
  };
  orders[i] = next;
  await writeOrders(orders);
  return next;
}

export async function updateOrderPayment(
  id: string,
  payment: OrderPayment,
  status?: OrderStatus,
): Promise<Order | null> {
  const orders = await readOrders();
  const i = orders.findIndex((o) => o.id === id);
  if (i < 0) return null;
  const current = orders[i]!;
  const next: Order = {
    ...current,
    payment,
    status: status ?? current.status,
  };
  orders[i] = next;
  await writeOrders(orders);
  return next;
}
