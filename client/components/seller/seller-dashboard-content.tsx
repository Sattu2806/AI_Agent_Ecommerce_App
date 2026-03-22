"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Search,
  Bell,
  ChevronDown,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { fetchSellerDashboard, type SellerDashboard } from "@/lib/seller";
// import { updateOrderStatusAsSeller } from "@/lib/orders";
// import { useChatSidebar } from "@/contexts/chat-sidebar-context";

const statusVariants: Record<string, "secondary" | "default" | "outline" | "destructive"> = {
  pending: "secondary",
  processing: "default",
  paid: "default",
  shipped: "outline",
  delivered: "default",
  failed: "destructive",
  refunded: "secondary",
  cancelled: "secondary",
};

type SellerDashboardContentProps = {
  sellerId: string;
};

export function SellerDashboardContent({ sellerId }: SellerDashboardContentProps) {
//   const { openStoreSetup } = useChatSidebar();
  const [data, setData] = useState<SellerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
//   const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchSellerDashboard()
      .then((d) => {
        setData(d ?? null);
        if (!d) setError("Failed to load dashboard");
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <p className="text-destructive">{error ?? "Failed to load dashboard"}</p>
      </div>
    );
  }

  const { seller, stats, recentOrders, products } = data;
  const storeInitials = seller.storeName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      sub: "From your products",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: String(stats.orderCount),
      sub: "Orders containing your products",
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: String(stats.productCount),
      sub: "Listed in your store",
      icon: Package,
    },
    {
      title: "Customers",
      value: String(stats.customerCount),
      sub: "Unique buyers",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="size-4" />
            </div>
            <span className="font-semibold">Seller Dashboard</span>
          </div>

          <div className="flex flex-1 items-center justify-center gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders, products, customers..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative gap-2 pl-2 pr-1">
                  <Avatar className="size-8">
                    <AvatarFallback>{storeInitials}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{seller.storeName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem onClick={openStoreSetup} className="gap-2">
                  <Sparkles className="size-4" />
                  Update store with AI
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                  <Link href={`/seller/${sellerId}/profile`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/seller/${sellerId}/settings`}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="text-muted-foreground">
                    Account profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your store performance and recent activity.
            <span className="ml-1 font-medium text-foreground">
              {seller.storeName}
            </span>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent orders</CardTitle>
                <CardDescription>
                  Latest orders containing your products
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                {recentOrders.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No orders yet. Orders that include your products will appear here.
                  </div>
                ) : (
                  recentOrders.map((order, i) => (
                    <div key={order.id}>
                      {i > 0 && <Separator />}
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                        <div className="space-y-1">
                          <p className="font-mono text-sm font-medium">
                            {order.id.slice(0, 8)}…
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.customer}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{order.amount}</span>
                          <Badge
                            variant={statusVariants[order.status] ?? "secondary"}
                            className="capitalize"
                          >
                            {order.status}
                          </Badge>
                          {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={updatingOrderId === order.id}
                              >
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Change status</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {["pending", "paid", "processing", "shipped", "delivered", "failed", "refunded", "cancelled"].map(
                                (s) => (
                                  <DropdownMenuItem
                                    key={s}
                                    disabled={updatingOrderId === order.id || order.status === s}
                                    onClick={async () => {
                                      try {
                                        setUpdatingOrderId(order.id);
                                        await updateOrderStatusAsSeller(order.id, s.toUpperCase());
                                        setData((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                recentOrders: prev.recentOrders.map((o) =>
                                                  o.id === order.id ? { ...o, status: s } : o
                                                ),
                                              }
                                            : prev
                                        );
                                      } catch (err) {
                                        console.error(err);
                                      } finally {
                                        setUpdatingOrderId(null);
                                      }
                                    }}
                                  >
                                    <span className="capitalize">{s}</span>
                                  </DropdownMenuItem>
                                )
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu> */}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>
                Shortcuts for common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href={`/seller/${sellerId}/products/new`}>
                  <Package className="mr-2 size-4" />
                  Add product
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href={`/seller/${sellerId}`}>
                  <ShoppingCart className="mr-2 size-4" />
                  View dashboard
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/">
                  <Users className="mr-2 size-4" />
                  Storefront
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your products</CardTitle>
              <CardDescription>
                Products listed in your store
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/seller/${sellerId}/products/new`}>
                Add product
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No products yet. Add your first product to start selling.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col overflow-hidden rounded-lg border bg-card"
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="block aspect-square w-full overflow-hidden bg-muted"
                    >
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Package className="size-12 text-muted-foreground" />
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col gap-1 p-3">
                      <p className="truncate font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.category && product.category !== "general" && (
                        <Badge variant="secondary" className="w-fit text-xs capitalize">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-dashed text-xs"
                        asChild
                      >
                        <Link href={`/product/${product.id}`}>View</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        asChild
                      >
                        <Link href={`/seller/${sellerId}/products/${product.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
