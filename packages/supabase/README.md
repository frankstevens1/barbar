# Supabase Package

## auth hooks

[JWT Claims](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac?queryGroups=language&language=plpgsql)

[Auth Hooks](https://supabase.com/dashboard/project/nbnfqxzmnnluqcenoqkm/auth/hooks)

## auth/callback and auth/confirm

Add the following to `auth/callback/route.ts` file:

```typescript
import { createClient } from "@workspace/supabase/client/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    try {
      const supabase = await createClient();
      
      // Try to exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Failed to exchange code for session:", error.message);
        return NextResponse.json({ message: "Session exchange failed", error: error.message }, { status: 500 });
      }

    } catch (err) {
      console.error("An error occurred during session exchange:", err);
      return NextResponse.json({ message: "An unexpected error occurred", error: err }, { status: 500 });
    }
  } else {
    console.error(JSON.stringify(requestUrl));
    console.error("No auth code provided in URL");
    return NextResponse.json({ message: "No auth code provided" }, { status: 400 });
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  return NextResponse.redirect(`${origin}`);
}
```

Add the following to `auth/confirm/route.ts` file:

```typescript
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@workspace/supabase/client/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next)
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/support')
}
```

## Components

## Pages

Example page using the `Login` page component:

```typescript
import Login from "@workspace/supabase/pages/sign-in";
import { Message } from "@workspace/supabase/components/form-message";
import { BASE_URL } from "@/lib/base_url";

interface PageProps {
  searchParams: Promise<Message & { redirectTo?: string }>;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden">
      <Login
        searchParams={searchParams}
        base_url={BASE_URL}
      />
    </div>
  )
}
```

## Client

## Lib

Add the following to your `lib/base_url.ts` file:

```typescript
export const BASE_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:3001" 
  : "https://df-tenant.vercel.app";
```

## Providers

### Email

### Google

### GitHub

## Email Templates

Add email templates to your supabase project's [Auth Email Templates](https://supabase.com/dashboard/project/eifqgqovhelypksbbwpk/auth/templates).

Templates are provided in the `./src/auth/email-templates` directory. These are only examples and can be customized to your project's needs.

### Prequisites

Create a public storage bucket in supabase with the title: `assets`, and upload an `email-logo.png` there.

### Example: Confirm Signup Template

```html
<div style="text-align: center; padding: 40px; font-family: Arial, sans-serif;">
    <img 
      src="https://<supabase_project_id>.supabase.co/storage/v1/object/public/assets/email-logo.png"
      alt="Logo" 
      style="max-width: 150px; margin-bottom: 30px;"
    />
  
    <h2 style="font-size: 28px; font-weight: bold; color: #333; margin-bottom: 24px;">
      Confirm your signup
    </h2>
  
    <p style="font-size: 18px; color: #666; margin-bottom: 24px;">
      Follow this link to create your account:
    </p>
  
    <a 
      href="{{ .ConfirmationURL }}" 
      style="display: inline-block; background-color: #457575 ; color: white; padding: 14px 28px; text-decoration: none; font-size: 18px; border-radius: 8px; margin-bottom: 30px;">
      Confirm your mail
    </a>
</div>
```
