"use client";

import { toast } from "sonner";
import { useState, useCallback } from "react";

interface TenantRow {
  id: string;
  name: string;
}

export function useTenant() {
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(false);

  const fetchTenants = useCallback(async () => {
    setLoadingTenants(true);
    try {
      const res = await fetch("/api/df-tenant");
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error fetching tenants:", errorData);
        setTenants([]);
      } else {
        const data = await res.json();
        setTenants(data.tenants || []);
      }
    } catch (err) {
      console.error("Error in fetchTenants:", err);
      setTenants([]);
    } finally {
      setLoadingTenants(false);
    }
  }, []);

  const selectTenant = useCallback(
    async (tenantId: string) => {
      try {
        const tenant = tenants.find((t) => t.id === tenantId);
        const tenantName = tenant ? tenant.name : tenantId;
  
        const res = await fetch("/api/df-tenant/select", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenantId }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error setting tenant:", errorData);
          alert(`Error setting tenant: ${errorData.error || "Unknown error"}`);
          return;
        }
        toast.success(`Viewing ${tenantName}`);
      } catch (err) {
        console.error("Error in selectTenant:", err);
        alert("Failed to set tenant");
      }
    },
    [tenants]
  );

  return {
    tenants,
    loadingTenants,
    fetchTenants,
    selectTenant,
  };
}
