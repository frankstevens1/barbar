"use server";

import { jwtDecode } from 'jwt-decode';
import { createClient } from "../client/server";
import { getTenantByDomain } from "./tenant-utils";
import { CustomJwtPayload } from "../types";
import { headers } from 'next/headers';

export async function tenantAccess(origin?: string | null) {
  const supabase = await createClient();
  const headersList = await headers();

  // ------------------------------------------------------------------
  // 1. Retrieve the user and decode the JWT to get userRole (if any)
  // ------------------------------------------------------------------
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole: string | null = null;
  try {
    const { data: session } = await supabase.auth.getSession();
    const accessToken = session.session?.access_token;
    if (accessToken) {
      const decoded = jwtDecode<CustomJwtPayload>(accessToken);
      userRole = decoded.user_role;
    }
  } catch (err) {
    console.error("Error decoding JWT:", err);
  }

  // ------------------------------------------------------------------
  // 2. Check if a dev-tenant override cookie is present
  // ------------------------------------------------------------------
  const cookieHeader = headersList.get("cookie") || "";
  const devMatch = cookieHeader.match(/X-DevTenantId=([^;]+)/);
  const devTenantId = devMatch && devMatch[1] ? decodeURIComponent(devMatch[1]) : null;
  if (devTenantId) {
    // Attempt to fetch the tenant row directly by ID
    const { data: devTenantData, error: devError } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", devTenantId)
      .single();

    if (!devError && devTenantData) {
      const { config, ...tenantDataWithoutConfig } = devTenantData;
      const devTenantConfig = config || {};

      return {
        // Short-circuit with dev-tenant
        tenant: {
          is_tenant_admin: "", // or set if relevant
          tenant_name: devTenantData.name,
          tenant_id: devTenantData.id,
        },
        tenantData: tenantDataWithoutConfig,
        tenantConfig: devTenantConfig,
        user,      // from above
        userRole,  // from above
        tenantError: null,
      };
    }
    // If devTenantId is invalid or not found, fall through to domain-based logic
  }

  // ------------------------------------------------------------------
  // 3. Domain-based tenant resolution
  // ------------------------------------------------------------------
  let domain = "datafluent.one";
  if (origin) {
    const url = new URL(origin);
    domain = url.port ? `${url.hostname}:${url.port}` : url.hostname;
  } else {
    domain = headersList.get("host") || "datafluent.one";
  }

  const tenant = await getTenantByDomain(domain);
  if (!tenant) {
    // No tenant found for this domain
    const tenantError = `No tenant found for domain ${domain}`;
    return {
      tenant: null,
      tenantData: null,
      tenantConfig: null,
      user,        // at least we return user & userRole
      userRole,
      tenantError,
    };
  }

  // Fetch the full tenant row
  const { data: tenantData, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", tenant.tenant_id)
    .single();

  if (error) {
    const tenantDataError = `No tenant found for domain ${domain}`;
    return {
      tenant: null,
      tenantData: null,
      tenantConfig: null,
      user,
      userRole,
      tenantDataError,
    };
  }

  // ------------------------------------------------------------------
  // 4. Return final shape with tenant config removed from tenantData
  // ------------------------------------------------------------------
  const { config, ...tenantDataWithoutConfig } = tenantData;
  const tenantConfig = config || {};

  return {
    tenant,
    tenantData: tenantDataWithoutConfig,
    tenantConfig,
    user,
    userRole,
    tenantError: null,
  };
}
