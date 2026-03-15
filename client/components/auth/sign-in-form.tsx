"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signInSchema, type SignInInput } from "@/lib/auth-schema";
import {getGoogleAuthUrl, login, setToken } from "@/lib/auth";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_not_configured: "Google sign-in is not configured.",
  missing_code: "Sign-in was cancelled or failed.",
  invalid_state: "Invalid request. Please try again.",
  token_exchange_failed: "Google sign-in failed. Please try again.",
  userinfo_failed: "Could not load your profile. Please try again.",
  missing_token: "Sign-in failed. Please try again.",
};

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setSubmitError(OAUTH_ERROR_MESSAGES[error] ?? "Sign-in failed. Please try again.");
      router.replace("/sign-in", { scroll: false });
    }
  }, [searchParams, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: SignInInput) {
    setSubmitError("");
    try {
      const { token } = await login(data.email, data.password);
      setToken(token);
      router.push("/");
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Sign in failed");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-4">
        {submitError && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {submitError}
          </p>
        )}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            className="h-11 rounded-xl"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            className="h-11 rounded-xl"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          className="h-11 w-full rounded-xl font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <span className="relative flex justify-center bg-card px-3 text-xs uppercase text-muted-foreground">
            or continue with
          </span>
        </div>
        <Button
          variant="outline"
          className="h-11 w-full rounded-xl font-medium"
          asChild
        >
          <a href={getGoogleAuthUrl()}>
            <GoogleIcon className="mr-2 size-5" />
            Sign in with Google
          </a>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}
