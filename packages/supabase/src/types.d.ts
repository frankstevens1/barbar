import { Database } from "./database.types.ts";

export type CustomJwtPayload = {
  user_role: string;
  [key: string]: any;
}

export type Domain = {
  domain: string;
  subdomain: string;
  loading: boolean;
}

export type Message = {
  success?: string;
  error?: string;
  message?: string;
  redirect_to?: string;
  tryAgainLink?: string;
  expected?: boolean;
};

export type Tenant = {
  is_tenant_admin: string;
  tenant_name?: string;
  tenant_id?: string;
}

export interface TenantConfig {
  site: {
    display_name: string;
  };
  stripe_connect_account: {
    active: boolean;
    account_id: string | null;
  };
  author: {
    name: string;
    url: string;
  };
  logo: {
    src: string;
    alt: string;
    href: string;
  };
  square_logo: boolean;
  nav_items: Array<{
    label: string;
    href: string;
    ext?: boolean;
  }>;
  socials: Array<{
    label: string;
    href: string;
    icon: string;
  }>;
  adminRoutes: string[];
  generalNavItems: Array<{
    title: string;
    url: string;
    icon: string;
  }>;
  adminNavItems: Array<{
    title: string;
    url: string;
    icon: string;
    items?: Array<{
      title: string;
      url: string;
    }>;
  }>;
  secondaryNavItems: Array<{
    title: string;
    url: string;
    icon: string;
  }>;
}

// src/types/supabase.ts -- as in `@supabase/supabase-js` package

/** 
 * A single external identity (e.g. GitHub, Google) linked to the user 
 */
export interface UserIdentity {
  id: string;
  user_id: string;
  identity_data: Record<string, any>;
  provider: string;
  created_at: string;
  last_sign_in_at: string;
  updated_at?: string;
}

/**
 * The shape of the Auth.User object returned by supabase-js
 */
export interface User {
  /** UUID */
  id: string;
  /** App-level metadata (e.g. roles, providers) */
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  /** Arbitrary user metadata you set on signup */
  user_metadata: Record<string, any>;
  /** Audience: e.g. "authenticated" */
  aud: string;

  // Timestamps (ISO strings) for various lifecycle events
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_change_sent_at?: string;
  new_email?: string;
  invited_at?: string;
  action_link?: string;
  email?: string;
  phone?: string;
  created_at: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;

  /** Optional role (if you’ve set up RLS/roles) */
  role?: string;

  /** Linked OAuth identities */
  identities?: UserIdentity[];
}
