import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { getServerEnv } from "@/lib/env"
import type { Database } from "@/lib/supabase/database.types"

/**
 * Supabase client dengan ANON KEY + cookie session user.
 * Dipakai hanya untuk autentikasi (login/logout/getUser), bukan untuk query admin.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  const { supabaseUrl, supabaseAnonKey } = getServerEnv()

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Component tidak boleh menulis cookie. Aman diabaikan karena
          // refresh session sudah ditangani oleh proxy.ts.
        }
      },
    },
  })
}
