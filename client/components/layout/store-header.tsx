"use client";

import Link from "next/link";
import { Image, MessageCircle, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/header-auth";
// import { useCart } from "@/contexts/cart-context";
// import { useChatSidebar } from "@/contexts/chat-sidebar-context";
// import { SearchBar } from "@/components/store/search-bar";

export function StoreHeader() {
//   const { totalCount } = useCart();
//   const { open: openChat } = useChatSidebar();
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Package className="size-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">AI Commerce Store</span>
        </Link>

        <div className="relative hidden flex-1 max-w-xl sm:block">
          {/* <SearchBar
            placeholder="Search products (e.g. wireless headphones)..."
            inputClassName="h-11 rounded-xl border-border/80 bg-muted/50 font-medium placeholder:text-muted-foreground focus-visible:bg-background"
          /> */}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden rounded-xl sm:flex"
            asChild
          >
            <Link href="/ai-search" title="AI Search (text + image)">
              <Image className="mr-1.5 size-4" />
              AI Search
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-xl"
            // onClick={openChat}
            title="AI assistant"
            aria-label="Open chat with assistant"
          >
            <MessageCircle className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative size-11 rounded-xl"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="size-5" />
              {/* {totalCount > 0 && (
                <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
              <span className="sr-only">Cart ({totalCount} items)</span> */}
            </Link>
          </Button>
          <HeaderAuth />
        </div>
      </div>

      <div className="border-t border-border/40 px-4 py-2.5 sm:hidden">
        {/* <SearchBar
          placeholder="Search products..."
          inputClassName="h-10 rounded-lg border-border/80 bg-muted/50"
        /> */}
      </div>
    </header>
  );
}
