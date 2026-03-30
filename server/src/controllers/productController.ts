import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import type { JwtPayload } from "../middleware/authMiddleware.js";
type AuthRequest = Request & { user?: JwtPayload };

export async function createProduct(req: AuthRequest, res: Response) {
  const payload = req.user;
  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const seller = await prisma.seller.findUnique({
    where: { userId: payload.userId },
  });

  if (!seller) {
    res.status(403).json({
      error: "Seller profile required. Set up your store first.",
    });
    return;
  }

  const VALID_CATEGORIES = ["general", "electronics", "clothing", "home", "sports"] as const;

  const body = req.body as {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    imageUrl?: string;
    imageUrls?: string[];
  };

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const price =
    typeof body.price === "number"
      ? body.price
      : typeof body.price === "string"
        ? parseFloat(body.price)
        : NaN;
  const rawCategory = typeof body.category === "string" ? body.category.trim().toLowerCase() : "";
  const category = rawCategory && VALID_CATEGORIES.includes(rawCategory as (typeof VALID_CATEGORIES)[number])
    ? rawCategory
    : "general";
  const imageUrls = Array.isArray(body.imageUrls)
    ? body.imageUrls.filter((u): u is string => typeof u === "string" && u.trim().length > 0)
    : [];
  const imageUrl =
    imageUrls.length > 0
      ? imageUrls[0]
      : typeof body.imageUrl === "string"
        ? body.imageUrl.trim() || null
        : null;

  if (!title || title.length < 2) {
    res.status(400).json({ error: "Title is required (min 2 characters)" });
    return;
  }
  if (!description || description.length < 10) {
    res.status(400).json({
      error: "Description is required (min 10 characters)",
    });
    return;
  }
  if (Number.isNaN(price) || price < 0) {
    res.status(400).json({ error: "Valid price is required (≥ 0)" });
    return;
  }

  try {
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        category,
        imageUrl: imageUrl ?? undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        sellerId: seller.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        category: true,
        imageUrl: true,
        sellerId: true,
        createdAt: true,
      },
    });

    // Index in vector DB for semantic search (include vision analysis of image when present)
    // (async () => {
    //   try {
    //     let imageAnalysis: string | null = null;
    //     if (product.imageUrl) {
    //       try {
    //         imageAnalysis = await analyzeImageWithVision(product.imageUrl);
    //       } catch (visionErr) {
    //         // Vision not configured or failed; index without image description
    //       }
    //     }
    //     await indexProduct(
    //       {
    //         id: product.id,
    //         title: product.title,
    //         description: product.description,
    //         price: product.price,
    //         category: product.category,
    //         sellerId: product.sellerId,
    //       },
    //       imageAnalysis ?? undefined
    //     );
    //   } catch (err) {
    //     console.error("[Vector] Failed to index product:", product.id, err);
    //   }
    // })();

    res.status(201).json({ product });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
}

export async function updateMyProduct(req: AuthRequest, res: Response) {
  const payload = req.user;
  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const productId = (req.params as { productId?: string }).productId;
  if (!productId) {
    res.status(400).json({ error: "Product ID is required" });
    return;
  }

  const seller = await prisma.seller.findUnique({
    where: { userId: payload.userId },
    select: { id: true },
  });

  if (!seller) {
    res.status(403).json({
      error: "Seller profile required. Set up your store first.",
    });
    return;
  }

  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      sellerId: true,
    },
  });

  if (!existing || existing.sellerId !== seller.id) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const VALID_CATEGORIES = ["general", "electronics", "clothing", "home", "sports"] as const;

  const body = req.body as {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    imageUrl?: string;
    imageUrls?: string[];
  };

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const price =
    typeof body.price === "number"
      ? body.price
      : typeof body.price === "string"
        ? parseFloat(body.price)
        : NaN;
  const rawCategory = typeof body.category === "string" ? body.category.trim().toLowerCase() : "";
  const category = rawCategory && VALID_CATEGORIES.includes(rawCategory as (typeof VALID_CATEGORIES)[number])
    ? rawCategory
    : "general";
  const imageUrls = Array.isArray(body.imageUrls)
    ? body.imageUrls.filter((u): u is string => typeof u === "string" && u.trim().length > 0)
    : [];
  const imageUrl =
    imageUrls.length > 0
      ? imageUrls[0]
      : typeof body.imageUrl === "string"
        ? body.imageUrl.trim() || null
        : null;

  if (!title || title.length < 2) {
    res.status(400).json({ error: "Title is required (min 2 characters)" });
    return;
  }
  if (!description || description.length < 10) {
    res.status(400).json({
      error: "Description is required (min 10 characters)",
    });
    return;
  }
  if (Number.isNaN(price) || price < 0) {
    res.status(400).json({ error: "Valid price is required (≥ 0)" });
    return;
  }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price,
        category,
        imageUrl: imageUrl ?? undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        category: true,
        imageUrl: true,
        sellerId: true,
        createdAt: true,
      },
    });

    // Re-index in vector DB, preserving any existing embedded content (e.g. first-time LLM info),
    // and appending updated product details.
    // (async () => {
    //   try {
    //     await reindexProductKeepingExistingContent({
    //       id: product.id,
    //       title: product.title,
    //       description: product.description,
    //       price: product.price,
    //       category: product.category,
    //       sellerId: product.sellerId,
    //     });
    //   } catch (err) {
    //     console.error("[Vector] Failed to re-index product:", product.id, err);
    //   }
    // })();

    res.json({ product });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
}

export async function getProduct(req: Request, res: Response) {
  const productId = req.params.productId as string;
  if (!productId) {
    res.status(400).json({ error: "Product ID required" });
    return;
  }
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        category: true,
        imageUrl: true,
        imageUrls: true,
        sellerId: true,
        createdAt: true,
        seller: {
          select: {
            id: true,
            storeName: true,
            storeLogo: true,
          },
        },
      },
    });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ product });
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ error: "Failed to load product" });
  }
}