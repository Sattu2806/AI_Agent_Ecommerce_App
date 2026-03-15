import { StoreHeader } from "@/components/layout/store-header";
import { SignInForm } from "@/components/auth/sign-in-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <StoreHeader />
      <main className="mx-auto flex max-w-md flex-col justify-center px-4 py-12 sm:py-16">
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to sign in to your account
            </CardDescription>
          </CardHeader>
          <SignInForm />
        </Card>
      </main>
    </div>
  );
}
