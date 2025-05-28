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
