import { createClient } from "@supabase/supabase-js"

// Server-side Supabase client that acts *as the logged-in user*: their access
// token rides along on every request, so auth.uid() in SQL is them and all the
// usual security rules apply. Deliberately not the service-role (admin) key,
// which would bypass every rule in the database.
export function supabaseAsUser(accessToken: string) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
