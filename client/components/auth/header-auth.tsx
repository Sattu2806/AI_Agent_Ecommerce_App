"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Package, Settings, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getToken, fetchMe, clearToken, type AuthUser } from "@/lib/auth";

function getInitials(user: AuthUser): string {
  if (user.name?.trim()) {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}

export function HeaderAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  function handleLogout() {
    clearToken();
    router.push("/sign-in");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="size-10 animate-pulse rounded-full bg-muted" />
    );
  }

  if (!user) {
    return (
      <Button variant="ghost" size="sm" className="rounded-xl" 
      asChild
      >
        <Link href="/sign-in">Sign in</Link>
      </Button>
    );
  }

  const initials = getInitials(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
      asChild
      >
        <Button
          variant="ghost"
          className="relative flex items-center gap-2 rounded-xl p-1.5"
        >
          <Avatar className="size-9">
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name ?? user.email}
                referrerPolicy="no-referrer"
              />
            )}
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Account menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <p className="font-medium">{user.name || "Account"}</p>
            <p className="text-xs font-normal text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
        asChild
        >
          <Link href="/profile" className="flex items-center gap-2">
            <User className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
        asChild
        >
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
        asChild
        >
          <Link href="/my-orders" className="flex items-center gap-2">
            <ShoppingBag className="size-4" />
            My orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
        asChild
        >
          <Link href="/seller" className="flex items-center gap-2">
            <Package className="size-4" />
            Seller dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
