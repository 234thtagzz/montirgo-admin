import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"
import { io } from "next/cache"
import type { User } from "@supabase/supabase-js"

import { getServerEnv } from "@/lib/env"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type AdminUser = {
  id: string
  email: string | null
  name: string
}

/**
 * Session user dari cookie. Di-cache per request agar beberapa Server Component
 * tidak melakukan panggilan auth berulang kali.
 *
 * `io()` menandai pembacaan session sebagai request-time, sehingga Supabase
 * auth boleh memakai `Date.now()` (cek kedaluwarsa token) tanpa memicu
 * peringatan prerender Cache Components. Di Server Action `io()` langsung
 * resolve.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  await io()
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

/**
 * Admin = email ada di allowlist ADMIN_EMAILS, ATAU role database = 'admin'.
 * Allowlist hanya untuk bootstrap admin pertama; sumber kebenaran tetap
 * `public.has_role('admin')` di database (bukan metadata/string di client).
 */
export async function isAdminUser(user: User): Promise<boolean> {
  const { adminEmails } = getServerEnv()
  const email = user.email?.toLowerCase()

  if (email && adminEmails.includes(email)) return true

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.rpc("has_role", {
    required_role: "admin",
  })

  if (error) {
    console.error("[auth] gagal memeriksa role admin:", error.message)
    return false
  }

  return data === true
}

/**
 * Guard untuk Server Component dan Server Action.
 * Semua query service-role WAJIB melewati fungsi ini lebih dulu.
 */
export const requireAdmin = cache(async (): Promise<AdminUser> => {
  const user = await getCurrentUser()

  if (!user) redirect("/login")
  if (!(await isAdminUser(user))) redirect("/unauthorized")

  return {
    id: user.id,
    email: user.email ?? null,
    name:
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "Admin",
  }
})
