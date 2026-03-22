import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import type { JwtPayload } from "../middleware/authMiddleware.js";

type AuthRequest = Request & { user?: JwtPayload };

const sellerSelect = {
  id: true,
  userId: true,
  storeName: true,
  storeLogo: true,
  description: true,
  contactEmail: true,
  returnPolicy: true,
  totalSales: true,
} as const;

export async function getMe(req: AuthRequest, res: Response) {
  const payload = req.user;
  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const seller = await prisma.seller.findUnique({
    where: { userId: payload.userId },
    select: sellerSelect,
  });

  if (!seller) {
    res.status(404).json({ error: "Seller profile not found" });
    return;
  }

  res.json({ seller });
}

export async function updateMe(req: AuthRequest, res: Response) {
  const payload = req.user;
  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const existing = await prisma.seller.findUnique({
    where: { userId: payload.userId },
  });
  if (!existing) {
    res.status(404).json({ error: "Seller profile not found" });
    return;
  }

  const body = req.body as {
    storeName?: string;
    storeLogo?: string | null;
    description?: string | null;
    contactEmail?: string | null;
    returnPolicy?: string | null;
  };

  const updates: {
    storeName?: string;
    storeLogo?: string | null;
    description?: string | null;
    contactEmail?: string | null;
    returnPolicy?: string | null;
  } = {};

  if (typeof body.storeName === "string") {
    const trimmed = body.storeName.trim();
    if (trimmed.length < 2) {
      res.status(400).json({ error: "Store name must be at least 2 characters" });
      return;
    }
    updates.storeName = trimmed;
  }
  if (body.storeLogo !== undefined) {
    updates.storeLogo = typeof body.storeLogo === "string" ? body.storeLogo.trim() || null : null;
  }
  if (body.description !== undefined) {
    updates.description = typeof body.description === "string" ? body.description.trim() || null : null;
  }
  if (body.contactEmail !== undefined) {
    updates.contactEmail = typeof body.contactEmail === "string" ? body.contactEmail.trim() || null : null;
  }
  if (body.returnPolicy !== undefined) {
    updates.returnPolicy = typeof body.returnPolicy === "string" ? body.returnPolicy.trim() || null : null;
  }

  if (Object.keys(updates).length === 0) {
    const seller = await prisma.seller.findUnique({
      where: { id: existing.id },
      select: sellerSelect,
    });
    res.json({ seller });
    return;
  }

  const seller = await prisma.seller.update({
    where: { id: existing.id },
    data: updates,
    select: sellerSelect,
  });
  res.json({ seller });
}

export async function setupStore(req: AuthRequest, res: Response) {
  const payload = req.user;
  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const body = req.body as { storeName?: string; description?: string };
  const storeName =
    typeof body.storeName === "string" ? body.storeName.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : null;

  if (!storeName || storeName.length < 2) {
    res.status(400).json({
      error: "Store name is required (min 2 characters)",
    });
    return;
  }

  const existing = await prisma.seller.findUnique({
    where: { userId: payload.userId },
  });
  if (existing) {
    res.json({ seller: existing });
    return;
  }

  const seller = await prisma.seller.create({
    data: {
      userId: payload.userId,
      storeName,
      description: description ?? undefined,
    },
    select: sellerSelect,
  });
  res.status(201).json({ seller });
}

type OrderItemRow = { productId: string; title: string; quantity: number; price: number };


export async function getDashboard(req: AuthRequest, res: Response) {
  const payload = req.user;
  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const seller = await prisma.seller.findUnique({
    where: { userId: payload.userId },
    select: {
      id: true,
      userId: true,
      storeName: true,
      storeLogo: true,
      description: true,
      totalSales: true,
    },
  });

  if (!seller) {
    res.status(404).json({ error: "Seller profile not found" });
    return;
  }

  const [sellerProducts, paidOrders] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        imageUrl: true,
        category: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: {
        status: {
          in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amountTotal: true,
        customerEmail: true,
        status: true,
        createdAt: true,
        items: true,
      },
    }),
  ]);

  const sellerProductIds = new Set(sellerProducts.map((p) => p.id));
  let totalRevenueCents = 0;
  const ordersWithSellerItems: Array<{
    id: string;
    customerEmail: string | null;
    amountTotal: number;
    sellerAmountCents: number;
    status: string;
    createdAt: Date;
  }> = [];

  for (const order of paidOrders) {
    const items = order.items as unknown as OrderItemRow[] | null;
    if (!Array.isArray(items)) continue;
    let sellerAmountCents = 0;
    for (const item of items) {
      if (!sellerProductIds.has(item.productId)) continue;
      const priceCents = Math.round((typeof item.price === "number" ? item.price : 0) * 100);
      sellerAmountCents += (typeof item.quantity === "number" ? item.quantity : 0) * priceCents;
    }
    if (sellerAmountCents <= 0) continue;
    totalRevenueCents += sellerAmountCents;
    ordersWithSellerItems.push({
      id: order.id,
      customerEmail: order.customerEmail ?? null,
      amountTotal: order.amountTotal,
      sellerAmountCents,
      status: order.status,
      createdAt: order.createdAt,
    });
  }

  const recentOrders = ordersWithSellerItems.slice(0, 10).map((o) => ({
    id: o.id,
    customer: o.customerEmail ?? "Guest",
    amount: `$${(o.sellerAmountCents / 100).toFixed(2)}`,
    status: o.status.toLowerCase(),
    createdAt: o.createdAt,
  }));

  const uniqueCustomers = new Set(
    ordersWithSellerItems.map((o) => o.customerEmail).filter(Boolean)
  ).size;

  const products = sellerProducts.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    imageUrl: p.imageUrl ?? undefined,
    category: p.category,
    createdAt: p.createdAt,
  }));

  res.json({
    seller,
    stats: {
      totalRevenue: totalRevenueCents / 100,
      orderCount: ordersWithSellerItems.length,
      productCount: sellerProducts.length,
      customerCount: uniqueCustomers,
    },
    recentOrders,
    products,
  });
}
