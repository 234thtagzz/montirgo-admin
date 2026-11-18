import "server-only"

/**
 * Nama env Supabase. Panel admin memakai konvensi Next.js (`NEXT_PUBLIC_*`),
 * tetapi tetap membaca nama `EXPO_PUBLIC_*` supaya `.env.local` yang disalin
 * dari repo aplikasi mobile (`montirGo_app`) bisa langsung dipakai.
 */
const SUPABASE_URL_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_URL",
] as const

const SUPABASE_ANON_KEY_KEYS = [
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
] as const

function readFirst(names: readonly string[]): string {
  for (const name of names) {
    const value = process.env[name]
    if (value) return value
  }
  return ""
}

function required(names: readonly string[]): string {
  const value = readFirst(names)
  if (!value) {
    throw new Error(
      `Environment variable ${names.join(" atau ")} belum diisi. Salin .env.example menjadi .env.local lalu isi kredensial Supabase.`
    )
  }
  return value
}

export type ServerEnv = {
  supabaseUrl: string
  supabaseAnonKey: string
  supabaseServiceRoleKey: string
  adminEmails: string[]
}

/** Env yang aman dibaca di edge/proxy (tanpa service role). */
export function getPublicSupabaseConfig(): {
  supabaseUrl: string
  supabaseAnonKey: string
  isConfigured: boolean
} {
  const supabaseUrl = readFirst(SUPABASE_URL_KEYS)
  const supabaseAnonKey = readFirst(SUPABASE_ANON_KEY_KEYS)
  return {
    supabaseUrl,
    supabaseAnonKey,
    // Service role hanya dicek keberadaannya (tidak pernah dikirim ke client).
    isConfigured: Boolean(
      supabaseUrl &&
        supabaseAnonKey &&
        process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
  }
}

/** Env server lengkap. Jangan pernah dipakai di Client Component. */
export function getServerEnv(): ServerEnv {
  return {
    supabaseUrl: required(SUPABASE_URL_KEYS),
    supabaseAnonKey: required(SUPABASE_ANON_KEY_KEYS),
    supabaseServiceRoleKey: required(["SUPABASE_SERVICE_ROLE_KEY"]),
    adminEmails: parseAdminEmails(process.env.ADMIN_EMAILS),
  }
}

export function parseAdminEmails(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

/** True jika seluruh kredensial yang dibutuhkan panel admin tersedia. */
export function isAdminAppConfigured(): boolean {
  return Boolean(
    readFirst(SUPABASE_URL_KEYS) &&
      readFirst(SUPABASE_ANON_KEY_KEYS) &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}
