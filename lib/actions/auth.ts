"use server"

import { redirect } from "next/navigation"

import { isAdminUser } from "@/lib/auth"
import { getServerEnv, isAdminAppConfigured } from "@/lib/env"
import { getAdminClient } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type SignInState = {
  error: string | null
}

export async function signInAction(
  _previousState: SignInState,
  formData: FormData
): Promise<SignInState> {
  if (!isAdminAppConfigured()) {
    return { error: "Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu." }
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." }
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return { error: "Email atau password salah." }
  }

  const allowed = await isAdminUser(data.user)
  if (!allowed) {
    await supabase.auth.signOut()
    return {
      error: "Akun ini tidak memiliki akses admin. Hubungi pemilik platform.",
    }
  }

  // Pastikan env service role ada sebelum masuk ke panel.
  const { adminEmails } = getServerEnv()

  // Bootstrap: email yang ada di ADMIN_EMAILS otomatis dipromosikan menjadi
  // role 'admin' di database. Dengan begitu role tetap berasal dari DB dan
  // proxy/RLS dapat menegakkannya pada request berikutnya.
  const emailLower = data.user.email?.toLowerCase()
  if (emailLower && adminEmails.includes(emailLower)) {
    const { error: promoteError } = await getAdminClient()
      .from("profiles")
      .upsert(
        {
          id: data.user.id,
          email: data.user.email ?? null,
          role: "admin",
        },
        { onConflict: "id" }
      )

    if (promoteError) {
      console.error("[auth] gagal bootstrap role admin:", promoteError.message)
    }
  }

  redirect("/")
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}
