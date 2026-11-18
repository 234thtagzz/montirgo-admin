"use server"

import { revalidatePath } from "next/cache"

import { requireAdmin } from "@/lib/auth"
import { isUuid } from "@/lib/format"
import { getAdminClient } from "@/lib/supabase/admin"

export type VerifyMechanicState = {
  status: "idle" | "success" | "error"
  message: string
}

export async function verifyMechanicAction(
  _previousState: VerifyMechanicState,
  formData: FormData
): Promise<VerifyMechanicState> {
  // Wajib: Server Action dapat dipanggil langsung lewat POST, bukan hanya
  // dari tombol di UI.
  const admin = await requireAdmin()

  const mechanicId = String(formData.get("mechanicId") ?? "")
  if (!isUuid(mechanicId)) {
    return { status: "error", message: "ID montir tidak valid." }
  }

  const db = getAdminClient()

  // `verified_by` dan `activity_logs.user_id` ber-FK ke profiles.id. Admin
  // bootstrap (lewat ADMIN_EMAILS) bisa saja belum punya baris profiles,
  // jadi relasi opsional ini diisi hanya jika profilnya ada.
  const { data: adminProfile } = await db
    .from("profiles")
    .select("id")
    .eq("id", admin.id)
    .maybeSingle()
  const adminProfileId = adminProfile?.id ?? null

  const { data: profile, error: profileError } = await db
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", mechanicId)
    .maybeSingle()

  if (profileError) {
    console.error("[montir] gagal membaca profil:", profileError.message)
    return { status: "error", message: "Gagal membaca data montir. Coba lagi." }
  }

  if (!profile || profile.role !== "mechanic") {
    return { status: "error", message: "Montir tidak ditemukan." }
  }

  const { data: updated, error: updateError } = await db
    .from("mechanic_profiles")
    .update({
      is_verified: true,
      verified_at: new Date().toISOString(),
      verified_by: adminProfileId,
    })
    .eq("profile_id", mechanicId)
    .select("profile_id, is_verified")
    .maybeSingle()

  if (updateError) {
    console.error("[montir] gagal verifikasi:", updateError.message)
    return {
      status: "error",
      message: "Verifikasi gagal disimpan. Periksa koneksi lalu coba lagi.",
    }
  }

  if (!updated) {
    return {
      status: "error",
      message: "Profil montir belum lengkap sehingga tidak dapat diverifikasi.",
    }
  }

  const displayName = profile.full_name?.trim() || "Montir"
  const { error: logError } = await db.from("activity_logs").insert({
    user_id: adminProfileId,
    activity_type: "mechanic_verified",
    description: `Admin ${admin.email ?? admin.id} memverifikasi montir ${displayName} (${mechanicId}).`,
    related_entity_type: "mechanic_profile",
    related_entity_id: mechanicId,
  })

  if (logError) {
    // Audit log gagal tidak boleh membatalkan verifikasi yang sudah tersimpan.
    console.error("[montir] gagal menulis activity log:", logError.message)
  }

  revalidatePath("/montir")
  revalidatePath("/")

  return {
    status: "success",
    message: `${displayName} berhasil diverifikasi dan sekarang berstatus AKTIF.`,
  }
}
