"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import ThirdPartyLogin from "../thirdparty-login";
import PasswordInput from "../password-input";
import { SubmitButton } from "../submit-button";

import { useSecureDomain } from "@workspace/supabase/hooks/use-domain";
import { signUpAction } from "@workspace/supabase/lib/auth-actions";

import { useResolvedParams } from "@workspace/supabase/lib/utils/use-resolved-params";
import { FormMessage } from "../form-message";
import { Message } from "@workspace/supabase/types";

interface PageProps {
  searchParams: Promise<Message & { redirectTo?: string }>;
  requirements_option: "option1" | "option2" | "option3";
}

export default function SignUp({ searchParams, requirements_option = "option1" }: PageProps) {
  const resolvedParams = useResolvedParams(searchParams);
  const domain = useSecureDomain();
  const base_url = "https://" + domain.subdomain + domain.domain;
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!isPasswordValid) {
      e.preventDefault();
      toast.error("Invalid password.", {
        description: "Please ensure your password meets the requirements",
      });
    }
  };

  if (domain.loading) {
    return <p>Loading</p>;
  }

  return (
    <form onSubmit={handleSubmit} action={signUpAction} className="p-4 max-w-xs w-full">
      <h1 className="text-2xl font-medium mb-6">Sign up</h1>
      <ThirdPartyLogin 
        base_url={base_url} 
        provider="github" 
        domain={domain.domain} 
      />
      <div className="h-2" />
      <ThirdPartyLogin 
        base_url={base_url} 
        redirectTo={resolvedParams.redirectTo} 
        provider="google" 
        domain={domain.domain} 
      />

      <p className="flex items-center justify-center text-sm my-6 text-gray-500">
        <span className="border-t border-gray-300 flex-grow mr-3"></span>
        or
        <span className="border-t border-gray-300 flex-grow ml-3"></span>
      </p>

      <div className="flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />

        <PasswordInput 
          selectedRequirement={requirements_option} 
          onValidationChange={setIsPasswordValid} 
          size="md" 
        />

        {/* Hidden domain input */}
        <input type="hidden" name="domain" value={domain.domain || ""} />

        <SubmitButton disabled={domain.loading} formAction={signUpAction} pendingText="Signing up...">
          Sign up
        </SubmitButton>

        <p className="text-sm text-foreground mt-4">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>

        <FormMessage message={resolvedParams} />
      </div>
    </form>
  );
}
