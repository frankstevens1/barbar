// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@workspace/supabase/client/middleware';
import { tenantAccess } from '@workspace/supabase/lib/tenant-access';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Retrieve tenant configuration from tenantAccess.
  // The tenantConfig contains keys such as adminRoutes and optionally protectedRoutes.
  const { tenantConfig } = await tenantAccess();

  // Set protected routes either from tenantConfig (if available) or default values.
  const protectedRoutes = tenantConfig?.protectedRoutes || ['/dashboard', '/reset-password'];
  
  // Set admin routes either from tenantConfig or fallback to defaults.
  const adminRoutes = tenantConfig?.adminRoutes || ["/dashboard/content", "/dashboard/sales"];

  const response = await updateSession(request as any, protectedRoutes, adminRoutes);
  return (response || NextResponse.next()) as NextResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
