import { StoreHeader } from "@/components/layout/store-header";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Sign up",
  description: "Create a new account",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <StoreHeader />
      <main className="mx-auto flex max-w-md flex-col justify-center px-4 py-12 sm:py-16">
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
            <CardDescription>
              Create an account to start shopping and managing your orders
            </CardDescription>
          </CardHeader>
          <SignUpForm />
        </Card>
      </main>
    </div>
  );
}
