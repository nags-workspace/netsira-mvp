// app/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// This function remains async
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // --- THIS IS THE FIX ---
        // Add the 'set' and 'remove' methods to allow Supabase to manage session cookies.
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // This is a Server Component, which cannot set cookies.
            // It's safe to ignore this error if you have middleware.ts configured.
            // Supabase will handle cookie refreshing through the middleware.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // This is a Server Component, which cannot set cookies.
            // It's safe to ignore this error if you have middleware.ts configured.
          }
        },
      },
    }
  );
}

// --- NEW: A dedicated client for admin actions using the Service Role Key ---
export function createSupabaseAdminClient() {
  // This client can bypass all RLS policies and should only be used in secure, server-side environments.
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}