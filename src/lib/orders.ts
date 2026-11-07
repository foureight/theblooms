import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { withFileLock } from "@/lib/file-lock";
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

async function readOrdersUnlocked(): Promise<Order[]> {
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

async function writeOrdersUnlocked(orders: Order[]) {
  await ensureOrdersFile();
  const file = ordersPath();
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, JSON.stringify({ orders }, null, 2), "utf8");
  await rename(tmp, file);
}

/** Read without exclusive lock (OK for admin lists / display). */
export async function readOrders(): Promise<Order[]> {
  return readOrdersUnlocked();
}

/**
 * Serialize all read-modify-write updates so two containers
 * sharing Local Storage cannot clobber each other's writes.
 */
async function mutateOrders(
  mutator: (orders: Order[]) => Order[] | Promise<Order[]>,
): Promise<Order[]> {
  return withFileLock(ordersPath(), async () => {
    const current = await readOrdersUnlocked();
    const next = await mutator(current);
    await writeOrdersUnlocked(next);
    return next;
  });
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
  const order: Order = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: input.status ?? "new",
    customer: input.customer,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    payment: input.payment,
    total: input.total,
  };
  await mutateOrders((orders) => {
    orders.unshift(order);
    return orders;
  });
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  let updated: Order | null = null;
  await mutateOrders((orders) => {
    const i = orders.findIndex((o) => o.id === id);
    if (i < 0) return orders;
    const current = orders[i]!;
    updated = { ...current, status };
    orders[i] = updated;
    return orders;
  });
  return updated;
}

export async function markOrderPaid(
  id: string,
  opts?: { stripeSessionId?: string },
): Promise<Order | null> {
  let updated: Order | null = null;
  await mutateOrders((orders) => {
    const i = orders.findIndex((o) => o.id === id);
    if (i < 0) return orders;
    const current = orders[i]!;
    updated = {
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
    orders[i] = updated;
    return orders;
  });
  return updated;
}

export async function updateOrderPayment(
  id: string,
  payment: OrderPayment,
  status?: OrderStatus,
): Promise<Order | null> {
  let updated: Order | null = null;
  await mutateOrders((orders) => {
    const i = orders.findIndex((o) => o.id === id);
    if (i < 0) return orders;
    const current = orders[i]!;
    updated = {
      ...current,
      payment,
      status: status ?? current.status,
    };
    orders[i] = updated;
    return orders;
  });
  return updated;
}

export async function updateOrderShipping(
  id: string,
  shipping: OrderShipping,
): Promise<Order | null> {
  let updated: Order | null = null;
  await mutateOrders((orders) => {
    const i = orders.findIndex((o) => o.id === id);
    if (i < 0) return orders;
    const current = orders[i]!;
    updated = { ...current, shipping };
    orders[i] = updated;
    return orders;
  });
  return updated;
}

export async function deleteOrder(id: string): Promise<boolean> {
  let removed = false;
  await mutateOrders((orders) => {
    const next = orders.filter((o) => o.id !== id);
    removed = next.length !== orders.length;
    return next;
  });
  return removed;
}
