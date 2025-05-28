"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../client/server";
import { encodedRedirect } from "./utils/encoded-redirect";
import { getTenant } from "./tenant-utils";
import { isValidEmail } from "./utils/encoded-redirect";
import { Tenant } from "../types";

export async function signUpAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const domain = formData.get('domain') as string;
  
  interface Options {
    data: Tenant;
  }

  let options: Options = { data: { is_tenant_admin: "false" } };
  try {
    const tenant = await getTenant(domain);
    options = { data: tenant };
  } catch (error) {
    if (error instanceof Error) {
      return redirect(`/support?error=${error.message}&tryAgainLink=/sign-up`);
    }
    return redirect(`/support?error=Internal+Server+Error&tryAgainLink=/sign-up`);
  }

  // Validate input fields
  if (!email || !password) {
    return encodedRedirect("error", "/sign-up", "Email and password are required.");
  }
  if (!isValidEmail(email)) {
    return encodedRedirect("error", "/sign-up", "Invalid email format.");
  }
  if (password.length < 8) {
    return encodedRedirect("error", "/sign-up", "Password must be at least 8 characters long.");
  }
  
  const data = {
    email,
    password,
    options,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error && error.name === "AuthWeakPasswordError") {
    return encodedRedirect(
      "error", 
      "/sign-up",
      // TO DO: docs page
      "Developer info! Ensure password requirements option is correctly set. https://datafluent.one/docs/auth/password-requirements/"
    );
  }
  if (error) {
    return redirect(`/support?error=${error.message}&tryAgainLink=/sign-up`);
  }
  return encodedRedirect("success", "/sign-in", "Check your email for a link to confirm your sign up.");
}


export const signInWithOAuth = async (
  provider: "google" | "github",
  redirectTo?: string,
  baseUrl?: string
) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${baseUrl}/auth/callback?redirect_to=${redirectTo || ""}?`,
    },
  });
  if (error) {
    return redirect(`/support?error=${error.name}&tryAgainLink=/sign-in`);
  }
}

export const signInAction = async (formData: FormData) => {
  const redirectTo = formData.get("redirectTo") as string | null;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error?.code === "invalid_credentials") {
    return encodedRedirect("error", "/sign-in", "Invalid email or password.");
  }

  if (error?.code === "email_not_confirmed") {
    return encodedRedirect("error", "/sign-in", "Email not confirmed. Check your email for the confirmation link.");
  }

  if (error) {
    return redirect(`/support?error=${error.code}&tryAgainLink=/sign-in`);
  }
  return redirect(redirectTo || "/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });
  if (error) {
    return redirect(`/support?error=${error.name}&tryAgainLink=/forgot-password`);
  }
  if (callbackUrl) {
    return redirect(callbackUrl);
  }
  return encodedRedirect("success", "/sign-in", "Check your email for a link to reset your password.");
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  if (!password || !confirmPassword) {
    return encodedRedirect("error", "/reset-password", "Password and confirm password are required");
  }
  if (password !== confirmPassword) {
    return encodedRedirect("error", "/reset-password", "Passwords do not match");
  }
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return redirect(`/support?error=${error.name}&tryAgainLink=/reset-password`);
  }
  return encodedRedirect("success", "/dashboard", "Password updated.");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};
