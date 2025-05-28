// --------------------------------------------------------------------------
// WARNING: This File Uses RPC Calls Which Override RLS Policies
// Until an alternate solution is found, this repo should not be made public
// --------------------------------------------------------------------------

import { generateTenantName } from "./utils/random-tenant";
import { DOMAIN } from "./utils/domain";
import { createClient } from "../client/server";
import { Tenant } from "../types";

const defaultTenant: Tenant = {
  is_tenant_admin: "false",
  tenant_name: "datafluent.one",
  tenant_id: "9ae9ff8c-bd8d-43b8-9b08-cfd592cbf1ae"
};

// function to call rpc to get tenant info based on domain
export async function getTenantByDomain(domain: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc('get_tenant_by_domain', {
      p_domain: domain,
    });
  if (error) {
    if (error.code === "PGRST202") {
      // undefined domain
      return { error: 'undefined domain', domain: domain };
    } else {
      return defaultTenant;
    }
  }
  if (!data) {
    // no tenant found
    return defaultTenant;
  }
  return data[0];
}

// Fetch tenant-related options based on the domain from the form.
export async function getTenant(
  domain: string | undefined,
) {
  
  if (!domain) {
    throw new Error("No domain provided");
  }

  if (domain.includes(DOMAIN)) {
    // Sign-up from the main domain.
    return {
      is_tenant_admin: "true",
      tenant_name: generateTenantName(),
    } as Tenant;
  } else {
    const data = await getTenantByDomain(domain);
    if (!data) {
      throw new Error(`No tenant found for domain ${domain}`);
    }
    return {
      is_tenant_admin: "false",
      tenant_id: data.tenant_id,
    } as Tenant;
  }
}

export async function setTenant(domain: string): Promise<void> {
  const supabase = await createClient();

  // Retrieve current user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  // Get tenant info based on the provided domain.
  const tenantResponse = await getTenant(domain);

  // Set the default config for the tenant.
  const config = {
    "site": {
      "display_name": tenantResponse.tenant_name,
    },
    "stripe_connect_account": {
      "active": false,
      "account_id": null
    }
  }
  
  // If the domain is the main domain, create a new datafluent tenant.
  if (domain === DOMAIN) {
    const { data: tenantData, error: tenantError } = await supabase.rpc('insert_tenant', {
      p_user_id: user.id,
      p_name: tenantResponse.tenant_name,
      p_config: config
    });    
    if (tenantError) {
      throw new Error(`Error creating tenant: ${tenantError.message}`);
    }
  } else {
    // Insert record into tenants_users table
    const { error: tenantUserError } = await supabase.rpc('insert_tenant_user', {
      p_tenant_id: tenantResponse.tenant_id,
      p_user_id: user.id,
    });    
    if (tenantUserError) {
      throw new Error(`Error inserting tenant user: ${tenantUserError.message}`);
    }
    // update relations tenant_id for user_id
    const { error: userTenantError } = await supabase.rpc('set_relations_tenant_id', {
      p_user_id: user.id,
      p_tenant_id: tenantResponse.tenant_id,
    });
    if (userTenantError) {
      throw new Error(`Error setting relations tenant id: ${userTenantError.message}`);
    }
  }

  return;
}