import { forgotPasswordAction } from "@workspace/supabase/lib/auth-actions";
import { SubmitButton } from "../submit-button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import Link from "next/link";
import { FormMessage } from "../form-message";
import { Message } from "@workspace/supabase/types";

interface PageProps {
  searchParams: Promise<Message & { redirectTo?: string }>;
}

export default async function ForgotPassword({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  return (
    <>
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <SubmitButton formAction={forgotPasswordAction}>
            Reset Password
          </SubmitButton>
          <FormMessage message={resolvedParams} />
        </div>
      </form>
    </>
  );
}
