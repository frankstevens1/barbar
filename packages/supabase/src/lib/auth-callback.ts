// libs/authCallback.ts
import { createClient } from "../client/server";
import { setTenant } from "./tenant-utils";

/**
 * Handles the authentication callback logic:
 * - Exchanges the code for a session.
 * - Checks the domain and, if needed, creates a tenant.
 * - Returns the redirect URL.
 *
 * @param requestUrl - The full request URL.
 * @returns An object with the final redirectUrl.
 * @throws Error if required parameters are missing or an operation fails.
 */
export async function handleAuthCallback(requestUrl: URL): Promise<{ redirectUrl: string }> {
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  const domain = origin.replace("https://", "").replace("http://", "");

  if (!code) {
    throw new Error("No auth code provided");
  }

  const supabase = await createClient();

  // Exchange code for session.
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    throw new Error(`Session exchange failed: ${error.message}`);
  }

  // If a domain is present, verify user and tenant.
  if (domain) {
    console.log(`Domain: ${domain}`);
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const redirectUrl = `${origin}/support?error=User+not+authenticated&tryAgainLink=${origin}`;
        return { redirectUrl };
      }
      const { data: existingTenant } = await supabase
        .from('tenants')
        .select('*')
        .eq('domain', domain)
        .single();
      if (!existingTenant) {
        await setTenant(domain);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Error inserting tenant user')) {
        console.log('No existing tenant.');
        // TODO - handle step gracefully
      } else {
        const redirectUrl = redirectTo ? `${origin}${redirectTo}` : origin;
        return { redirectUrl };
      }
    }
  }
  
  const redirectUrl = redirectTo ? `${origin}${redirectTo}` : origin;
  return { redirectUrl };
}
