"use client";

import { useEffect, useState } from "react";

export function useSecureDomain() {
  const [domain, setDomain] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const response = await fetch("/api/domain");
        const data = await response.json();

        if (data.domain) setDomain(data.domain);
        if (data.subdomain) setSubdomain(data.subdomain);
      } catch (error) {
        console.error("Error fetching domain:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomain();
  }, []);

  return { domain, subdomain, loading };
}
