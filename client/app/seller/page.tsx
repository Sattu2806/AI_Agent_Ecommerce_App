"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { fetchSellerMe } from "@/lib/seller";

export default function SellerPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/sign-in?redirect=/seller");
      return;
    }

    fetchSellerMe()
      .then((seller) => {
        if (!seller) {
          router.replace("/seller/setup");
          return;
        }
        router.replace(`/seller/${seller.id}`);
      })
      .catch(() => router.replace("/seller/setup"));
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading seller dashboard…</p>
      </div>
    </div>
  );
}
