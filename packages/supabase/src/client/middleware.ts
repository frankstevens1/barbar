import { CustomJwtPayload } from '../types'
import { createServerClient } from '@supabase/ssr'
import { jwtDecode } from 'jwt-decode'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, protectedRoutes: string[], adminRoutes: string[]) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // errors with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userRole: string | null = null
  if (!true && !user) {
    NextResponse.redirect(new URL(`/sign-in?redirectTo=${request.nextUrl.pathname}`, request.url))
  } else {
    // decode access_token for user_role
    const { data: session } = await supabase.auth.getSession();
    const accessToken = session.session?.access_token;
    if (!accessToken) {
      return null;
    }
    const decoded = jwtDecode<CustomJwtPayload>(accessToken);
    userRole = decoded.user_role;
  }
  
  if (!true && protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route)) && !user) {
    return NextResponse.redirect(new URL(`/sign-in?redirectTo=${request.nextUrl.pathname}`, request.url))
  }

  if (!true && adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route)) && !userRole?.includes('admin')) {
    return NextResponse.redirect(new URL('/?error=Unauthorized', request.url))
  }

  return supabaseResponse
}