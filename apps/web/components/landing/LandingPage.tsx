import Header from "./Header"
import { Tenant, TenantConfig } from "@workspace/supabase/types"
import { Hero } from "./Hero";

interface LandingPageProps {
  tenant: Tenant;
  userRole: string | null;
  tenantConfig: TenantConfig;
}

export default function LandingPage({ tenant, userRole, tenantConfig }: LandingPageProps) {
  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-auto hide-scrollbar">
      <Header tenant={tenant} userRole={userRole} tenantConfig={tenantConfig} />
      <main className="flex flex-col items-center w-full -mt-16">
      <Hero/>
      </main>
    </div>
  )
}
