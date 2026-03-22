"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { setupStore } from "@/lib/seller";
import { getToken } from "@/lib/auth";
// import { StoreSetupChat } from "@/components/seller/store-setup-chat";

type SetupView = "form" | "ai";

export default function SellerSetupPage() {
  const router = useRouter();
  const [view, setView] = useState<SetupView>("form");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/sign-in?redirect=/seller/setup");
    }
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const name = storeName.trim();
    if (!name || name.length < 2) {
      setError("Store name must be at least 2 characters");
      return;
    }
    setSubmitting(true);
    try {
      await setupStore(name, storeDescription.trim() || undefined);
      router.replace("/seller");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create store");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-md space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </Button>

        {view === "ai" ? (
        //   <StoreSetupChat onBackToForm={() => setView("form")} />
        <></>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Store className="size-6" />
              </div>
              <CardTitle>Become a seller</CardTitle>
              <CardDescription>
                Create your store to start selling. You can add products after this.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => setView("ai")}
                disabled={submitting}
              >
                <Sparkles className="size-4" />
                Set up your store with AI
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Our AI will ask a few questions; you can type or use voice. Then we&apos;ll create your store.
              </p>
            </CardContent>
            <form onSubmit={onSubmit}>
              <CardContent className="space-y-4 pt-2">
                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}
                <div className="space-y-2">
                  <label htmlFor="storeName" className="text-sm font-medium">
                    Store name *
                  </label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. My Shop"
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="storeDescription" className="text-sm font-medium">
                    Description (optional)
                  </label>
                  <Textarea
                    id="storeDescription"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    placeholder="Short description of your store"
                    rows={3}
                    disabled={submitting}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating…" : "Create store"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
