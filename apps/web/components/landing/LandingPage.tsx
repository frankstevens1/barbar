import Header from "./Header"
import { Tenant, TenantConfig } from "@workspace/supabase/types"

interface LandingPageProps {
  tenant: Tenant;
  userRole: string | null;
  tenantConfig: TenantConfig;
}

export default function LandingPage({ tenant, userRole, tenantConfig }: LandingPageProps) {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header tenant={tenant} userRole={userRole} tenantConfig={tenantConfig} />
      <main className="flex flex-col items-center w-full">
       ...
      </main>
    </div>
  )
}
