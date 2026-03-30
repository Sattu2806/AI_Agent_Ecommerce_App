import { API_URL, getToken } from "./auth";

export type Seller = {
  id: string;
  userId: string;
  storeName: string;
  storeLogo: string | null;
  description: string | null;
  contactEmail?: string | null;
  returnPolicy?: string | null;
  totalSales: number;
};

export type SellerDashboardStats = {
  totalRevenue: number;
  orderCount: number;
  productCount: number;
  customerCount: number;
};

export type SellerRecentOrder = {
  id: string;
  customer: string;
  amount: string;
  status: string;
  createdAt: string;
};

export type SellerDashboardProduct = {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  category: string;
  createdAt: string;
};

export type SellerDashboard = {
  seller: Seller;
  stats: SellerDashboardStats;
  recentOrders: SellerRecentOrder[];
  products: SellerDashboardProduct[];
};

export async function fetchSellerDashboard(): Promise<SellerDashboard | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_URL}/api/seller/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data as SellerDashboard;
}


export async function fetchSellerMe(): Promise<Seller | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_URL}/api/seller/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.seller ?? null;
}

export async function setupStore(storeName: string, description?: string): Promise<Seller> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_URL}/api/seller/setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ storeName, description: description || undefined }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to set up store");
  return data.seller;
}

export async function updateSellerProfile(params: {
  storeName?: string;
  storeLogo?: string | null;
  description?: string | null;
  contactEmail?: string | null;
  returnPolicy?: string | null;
}): Promise<Seller> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_URL}/api/seller/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update store");
  return data.seller;
}

export type SellerProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  category?: string;
  imageUrl: string | null;
  createdAt: string;
};

export async function createProduct(body: {
  title: string;
  description: string;
  price: number;
  category?: string;
  imageUrl?: string;
  imageUrls?: string[];
}): Promise<SellerProduct> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_URL}/api/seller/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create product");
  return data.product;
}


export async function updateProduct(
  productId: string,
  body: {
    title: string;
    description: string;
    price: number;
    category?: string;
    imageUrl?: string;
    imageUrls?: string[];
  }
): Promise<SellerProduct> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_URL}/api/seller/products/${encodeURIComponent(productId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update product");
  return data.product;
}