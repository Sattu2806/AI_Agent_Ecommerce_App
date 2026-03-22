"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { fetchSellerMe } from "@/lib/seller";

type SellerDashboardGuardProps = {
  sellerId: string;
  children: React.ReactNode;
};

export function SellerDashboardGuard({ sellerId, children }: SellerDashboardGuardProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/sign-in?redirect=/seller/" + encodeURIComponent(sellerId));
      return;
    }

    fetchSellerMe()
      .then((seller) => {
        if (!seller) {
          router.replace("/seller/setup");
          return;
        }
        if (seller.id !== sellerId) {
          router.replace("/seller");
          return;
        }
        setAllowed(true);
      })
      .catch(() => router.replace("/seller/setup"));
  }, [sellerId, router]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
