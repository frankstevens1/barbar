// hooks/useTenantConfig.ts
import { createClient } from "../client/client";
import { useState, useEffect } from "react";
// CHANGE: Import Sonner toast for notifications
import { toast } from "sonner";

export type NavItem = {
  ext?: boolean;
  href?: string;
  label?: string;
  url?: string;
  icon?: string;
  title?: string;
  items?: Array<{
    url: string;
    title?: string;
  }>;
};

export type SocialItem = {
  href: string;
  icon: string;
  label: string;
};

export type TenantConfig = {
  logo: {
    alt: string;
    src: string;
    href: string;
  };
  site: {
    display_name: string;
  };
  author: {
    url: string;
    name: string;
  };
  socials: SocialItem[];
  nav_items: NavItem[];
  adminRoutes: string[];
  square_logo: boolean;
  adminNavItems: NavItem[];
  generalNavItems: NavItem[];
  secondaryNavItems: NavItem[];
  stripe_connect_account: {
    active: boolean;
    account_id: string;
  };
};

export type Tenant = {
  id: string;
  config: TenantConfig;
};

const initialConfig: TenantConfig = {
  logo: { alt: "logo.png", src: "/logo.png", href: "/" },
  site: { display_name: "dev-datafluent.one" },
  author: { url: "https://datafluent.one", name: "datafluent" },
  socials: [
    { href: "mailto:info@domain", icon: "Mail", label: "Email" },
    { href: "https://github.com/frankstevens1", icon: "Github", label: "GitHub" }
  ],
  nav_items: [
    { ext: true, href: "https://datafluent.one/docs/getting-started", label: "Getting Started" },
    { href: "/roadmap", label: "Roadmap" }
  ],
  adminRoutes: ["/dashboard/sales", "/dashboard/content"],
  square_logo: false,
  adminNavItems: [
    {
      url: "/dashboard/sales",
      icon: "sales",
      items: [
        { url: "/dashboard/sales/products", title: "Products" },
        { url: "/dashboard/sales/tax", title: "Tax Settings" }
      ],
      title: "Sales"
    },
    {
      url: "/dashboard/content",
      icon: "content",
      items: [{ url: "/dashboard/content/editor" }],
      title: "Content"
    },
    { url: "/dashboard/editor", icon: "editor", title: "Editor" }
  ],
  generalNavItems: [
    { url: "/dashboard", icon: "home", title: "Dashboard" },
    { url: "/dashboard/account", icon: "user", title: "Account" }
  ],
  secondaryNavItems: [
    { url: "/support?support=true", icon: "support", title: "Support" },
    { url: "/support?feedback=true", icon: "feedback", title: "Feedback" }
  ],
  stripe_connect_account: { active: true, account_id: "acct_1R4pPwE6eZOVyx50" }
};

export function useTenantConfig() {
  const supabase = createClient();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [config, setConfig] = useState<TenantConfig>(initialConfig);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch logged in user's tenants
  useEffect(() => {
    const fetchTenants = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError("User not logged in");
        setLoading(false);
        return;
      }
      const userId = session.user.id;
      const { data, error } = await supabase
        .from("tenants")
        .select("id, config")
        .eq("user_id", userId);
      if (error) {
        setError("Error fetching tenants: " + error.message);
      } else {
        setTenants(data || []);
      }
      setLoading(false);
    };
    fetchTenants();
  }, [supabase]);

  // When a tenant is selected, load its config into state
  useEffect(() => {
    if (selectedTenantId) {
      const tenant = tenants.find((t) => t.id === selectedTenantId);
      if (tenant) {
        setConfig(tenant.config || initialConfig);
      }
    }
  }, [selectedTenantId, tenants]);

  // CHANGE: Update full config save to show toasts
  const saveConfig = async () => {
    if (!selectedTenantId) {
      setError("No tenant selected");
      toast.error("No tenant selected");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("tenants")
      .update({ config })
      .eq("id", selectedTenantId);
    if (error) {
      setError("Error saving config: " + error.message);
      toast.error("Error saving config: " + error.message);
    } else {
      toast.success("Config saved successfully!");
    }
    setSaving(false);
  };

  // CHANGE: New function to allow saving of an individual section
  const saveSection = async (section: keyof TenantConfig, sectionName?: string) => {
    if (!selectedTenantId) {
      setError("No tenant selected");
      toast.error("No tenant selected");
      return;
    }
    setSaving(true);
    // In this example, we update the full config object
    // (the section’s changes are already in state)
    const updatedConfig = { ...config };
    const { error } = await supabase
      .from("tenants")
      .update({ config: updatedConfig })
      .eq("id", selectedTenantId);
    if (error) {
      setError(`Error saving ${sectionName || section}: ${error.message}`);
      toast.error(`Error saving ${sectionName || section}: ${error.message}`);
    } else {
      toast.success(`${sectionName || section} saved successfully!`);
    }
    setSaving(false);
  };

  return {
    tenants,
    selectedTenantId,
    setSelectedTenantId,
    config,
    setConfig,
    loading,
    saving,
    error,
    saveConfig,
    saveSection, // expose new function for section saving
  };
}
