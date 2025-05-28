import LandingPage from "@/components/landing/LandingPage"
import { Message } from "@workspace/supabase/types";
import { tenantAccess } from "@workspace/supabase/lib/tenant-access";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<Message>;
  }) {
    const sParams = await searchParams
    // tenant
    const { 
      tenant,
      userRole,
      tenantConfig,
    } = await tenantAccess()

  return (
    <>
      <LandingPage tenant={tenant} userRole={userRole} tenantConfig={tenantConfig} />
    </>
  )
}
