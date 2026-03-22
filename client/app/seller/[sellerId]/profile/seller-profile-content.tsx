"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchSellerMe, type Seller } from "@/lib/seller";
import {
  Settings,
  Store,
  ChevronRight,
  Mail,
  FileText,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";

export function SellerProfileContent({ sellerId }: { sellerId: string }) {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerMe()
      .then((s) => {
        if (s && s.id === sellerId) setSeller(s);
      })
      .finally(() => setLoading(false));
  }, [sellerId]);

  if (loading || !seller) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const storeInitials = seller.storeName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center gap-4 px-6">
          <Link
            href={`/seller/${sellerId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <LayoutDashboard className="size-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Store profile</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Store profile</h1>
          <p className="mt-1 text-muted-foreground">
            How your store appears to buyers. Edit in Settings.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
              {seller.storeLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={seller.storeLogo}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {storeInitials}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl">{seller.storeName}</CardTitle>
              {seller.description && (
                <CardDescription className="mt-1 whitespace-pre-wrap">
                  {seller.description}
                </CardDescription>
              )}
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                {seller.contactEmail && (
                  <span className="flex items-center gap-1">
                    <Mail className="size-4" />
                    {seller.contactEmail}
                  </span>
                )}
                {seller.returnPolicy && (
                  <span className="flex items-center gap-1">
                    <FileText className="size-4" />
                    Return policy set
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total sales: <span className="font-medium text-foreground">${seller.totalSales.toFixed(2)}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick links</CardTitle>
            <CardDescription>Manage your store and products</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <Link
              href={`/seller/${sellerId}`}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="size-5 text-muted-foreground" />
                <span className="font-medium">Dashboard</span>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
            <Link
              href={`/seller/${sellerId}/settings`}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Settings className="size-5 text-muted-foreground" />
                <span className="font-medium">Settings</span>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
            <Link
              href="/"
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Store className="size-5 text-muted-foreground" />
                <span className="font-medium">Storefront</span>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
            <Link
              href={`/seller/${sellerId}/products/new`}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <PlusCircle className="size-5 text-muted-foreground" />
                <span className="font-medium">Add product</span>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
