"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      router.replace(`/sign-in?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token) {
      setToken(token);
      setStatus("done");
      router.replace("/");
      router.refresh();
    } else {
      setStatus("error");
      router.replace("/sign-in?error=missing_token");
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20">
      <p className="text-muted-foreground">
        {status === "loading" && "Signing you in…"}
        {status === "done" && "Redirecting…"}
        {status === "error" && "Redirecting to sign in…"}
      </p>
    </div>
  );
}
