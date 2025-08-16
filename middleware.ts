// middleware.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // --- DEBUGGING STEP 1 ---
  // This will show up in your terminal every time the middleware runs.
  console.log('--- Middleware running for path:', request.nextUrl.pathname);

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options, })
          response = NextResponse.next({ request: { headers: request.headers, }, })
          response.cookies.set({ name, value, ...options, })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options, })
          response = NextResponse.next({ request: { headers: request.headers, }, })
          response.cookies.set({ name, value: '', ...options, })
        },
      },
    }
  )

  // This call refreshes the session.
  const { data: { user } } = await supabase.auth.getUser();

  // --- DEBUGGING STEP 2 ---
  // This tells us if the middleware successfully found the user.
  console.log('--- Middleware user session:', user ? user.email : 'No user found');

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}