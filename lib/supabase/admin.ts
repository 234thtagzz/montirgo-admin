import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import { getServerEnv } from "@/lib/env"
import type { Database } from "@/lib/supabase/database.types"

/**
 * Supabase client dengan SERVICE ROLE KEY.
 *
 * - Hanya boleh diimpor dari Server Component, Server Action, atau Route Handler.
 * - `server-only` di atas akan membuat build gagal jika file ini bocor ke client.
 * - Service role membypass RLS, jadi SEMUA akses harus lewat pengecekan
 *   `requireAdmin()` terlebih dahulu.
 */
let adminClient: SupabaseClient<Database> | null = null

export function getAdminClient(): SupabaseClient<Database> {
  if (adminClient) return adminClient

  const { supabaseUrl, supabaseServiceRoleKey } = getServerEnv()

  adminClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    global: {
      headers: { "x-application-name": "montirgo-admin" },
    },
  })

  return adminClient
}
