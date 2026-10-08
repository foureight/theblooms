import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

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

export async function readOrders(): Promise<Order[]> {
  await ensureOrdersFile();
  try {
    const raw = await readFile(ordersPath(), "utf8");
    const parsed = JSON.parse(raw) as { orders?: Order[] } | Order[];
    const list = Array.isArray(parsed) ? parsed : (parsed.orders ?? []);
    return list
      .filter((o) => o && typeof o.id === "string")
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

export async function createOrder(input: {
  customer: OrderCustomer;
  items: OrderItem[];
  total: number;
}): Promise<Order> {
  const orders = await readOrders();
  const order: Order = {
    id: randomUUID().slice(0, 8),
    createdAt: new Date().toISOString(),
    status: "new",
    customer: input.customer,
    items: input.items,
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
