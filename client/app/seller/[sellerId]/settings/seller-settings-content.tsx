"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchSellerMe,
  updateSellerProfile,
  type Seller,
} from "@/lib/seller";
import { LayoutDashboard, Loader2, Bell, CreditCard } from "lucide-react";

export function SellerSettingsContent({ sellerId }: { sellerId: string }) {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSellerMe()
      .then((s) => {
        if (s && s.id === sellerId) {
          setSeller(s);
          setStoreName(s.storeName);
          setStoreLogo(s.storeLogo ?? "");
          setDescription(s.description ?? "");
          setContactEmail(s.contactEmail ?? "");
          setReturnPolicy(s.returnPolicy ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, [sellerId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!seller) return;
    setMessage(null);
    setSaving(true);
    try {
      const updated = await updateSellerProfile({
        storeName: storeName.trim(),
        storeLogo: storeLogo.trim() || null,
        description: description.trim() || null,
        contactEmail: contactEmail.trim() || null,
        returnPolicy: returnPolicy.trim() || null,
      });
      setSeller(updated);
      setMessage({ type: "ok", text: "Settings saved." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading || !seller) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

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
          <span className="font-medium">Settings</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Store settings</h1>
          <p className="mt-1 text-muted-foreground">
            Update your store profile, contact info, and policies.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store profile</CardTitle>
              <CardDescription>
                Name, logo, and description shown to buyers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="storeName" className="text-sm font-medium">
                  Store name *
                </label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="My Store"
                  required
                  minLength={2}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="storeLogo" className="text-sm font-medium">
                  Store logo URL
                </label>
                <Input
                  id="storeLogo"
                  type="url"
                  value={storeLogo}
                  onChange={(e) => setStoreLogo(e.target.value)}
                  placeholder="https://..."
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of your store"
                  rows={3}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
              <CardDescription>
                Email shown to buyers for inquiries (optional).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label htmlFor="contactEmail" className="text-sm font-medium">
                  Contact email
                </label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="store@example.com"
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Return policy</CardTitle>
              <CardDescription>
                Describe your return and refund policy for buyers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label htmlFor="returnPolicy" className="text-sm font-medium">
                  Policy text
                </label>
                <Textarea
                  id="returnPolicy"
                  value={returnPolicy}
                  onChange={(e) => setReturnPolicy(e.target.value)}
                  placeholder="e.g. Returns accepted within 30 days..."
                  rows={4}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>

          {message && (
            <p
              className={
                message.type === "ok"
                  ? "text-sm text-green-600"
                  : "text-sm text-destructive"
              }
            >
              {message.text}
            </p>
          )}

          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save all settings
          </Button>
        </form>

        <Card className="border-dashed opacity-80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="size-4" />
              Notifications
            </CardTitle>
            <CardDescription>
              Order and review email notifications. Coming soon.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-dashed opacity-80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4" />
              Payout information
            </CardTitle>
            <CardDescription>
              Connect a bank account for payouts. Coming soon.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
