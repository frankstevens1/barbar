"use client";

import { createClient } from '@workspace/supabase/client/client';

interface LogoProps {
  size?: number;
}

export function GoogleLogo({ size = 20 }: LogoProps) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      style={{ display: 'block', width: `${size}px`, height: `${size}px` }}
    >
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    </svg>
  );
}

export function GitHubLogo({ size = 20 }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style={{ display: 'block', width: `${size}px`, height: `${size}px` }}
    >
      <path
        fill="currentColor"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577v-2.26c-3.338.726-4.04-1.61-4.04-1.61-.547-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.24 1.838 1.24 1.07 1.835 2.805 1.305 3.49.998.11-.775.42-1.305.763-1.606-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.135-.303-.54-1.52.105-3.165 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 013.005-.404c1.02.005 2.05.14 3.005.405 2.28-1.555 3.28-1.23 3.28-1.23.645 1.645.24 2.862.12 3.165.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.63-5.475 5.92.43.37.81 1.096.81 2.215v3.284c0 .317.22.687.825.572C20.565 21.797 24 17.298 24 12 24 5.37 18.63 0 12 0z"
      />
    </svg>
  );
}

interface ThirdPartyLoginProps {
  redirectTo?: string;
  provider: 'google' | 'github';
  base_url: string;
  domain: string | null;
}

export default function ThirdPartyLogin(props: ThirdPartyLoginProps) {
  const signInWithThirdParty = async () => {
    const supabase = createClient();

    function buildCallbackUrl(baseUrl: string, params: Record<string, string | undefined>) {
      const url = new URL(baseUrl);
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
      return url.toString();
    }

    const callbackUrl = buildCallbackUrl(`${props.base_url}/auth/callback`, {
      redirect_to: props.redirectTo || "",
      domain: props.domain ?? undefined,
    });

    const { error } = await supabase.auth.signInWithOAuth({
      provider: props.provider,
      options: {
        redirectTo: callbackUrl,
      },
    });
    if (error) console.error("Error during OAuth sign-in:", error);
  };

  return (
    <div
      className="hover:bg-primary hover:text-primary-foreground bg-secondary text-secondary-foreground flex items-center justify-center gap-2 border h-full w-full p-2 rounded-lg cursor-pointer"
      onClick={signInWithThirdParty}
    >
      {props.provider === 'google' ? (
        <>
          <GoogleLogo size={20} />
          <p className="font-light">with Google</p>
        </>
      ) : (
        <>
          <GitHubLogo size={20} />
          <p className="font-light">with GitHub</p>
        </>
      )}
    </div>
  );
}
