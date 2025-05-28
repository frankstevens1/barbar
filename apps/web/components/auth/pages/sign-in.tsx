"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { signInAction } from "@workspace/supabase/lib/auth-actions";
import { SubmitButton } from "../submit-button";
import ThirdPartyLogin from "../thirdparty-login";
import { useSecureDomain } from "@workspace/supabase/hooks/use-domain";
import { useResolvedParams } from "@workspace/supabase/lib/utils/use-resolved-params";
import { FormMessage } from "../form-message";
import { Message } from "@workspace/supabase/types";

interface PageProps {
  searchParams: Message & { redirectTo?: string };
}

export default function Login({ searchParams }: PageProps) {
  const domain = useSecureDomain();
  const base_url = "https://" + domain.subdomain + domain.domain;
  
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (domain.loading) {
    return <p>Loading</p>
  }

  return (
    <form className="p-4 max-w-xs w-full">
      <h1 className="text-2xl font-medium mb-6">Sign in</h1>
      <ThirdPartyLogin 
        base_url={base_url} 
        provider="github"
        domain={domain.domain}
      />
      <div className="h-2" />
      <ThirdPartyLogin 
        base_url={base_url} 
        redirectTo={searchParams.redirectTo} 
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
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link className="text-xs text-foreground underline" href="/forgot-password">
            Forgot Password?
          </Link>
        </div>
        <div className="relative mb-3">
          <Input type={showPassword ? "text" : "password"} name="password" placeholder="Your password" required />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <input type="hidden" name="redirectTo" value={searchParams.redirectTo || "/"} />
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </SubmitButton>
        <p className="text-sm text-foreground mt-4">
          Don&apos;t have an account?{" "}
          <Link className="text-foreground font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
