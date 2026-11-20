import "server-only"

import { getAdminClient } from "@/lib/supabase/admin"

/**
 * Membuat signed URL untuk objek di bucket privat.
 * Path yang gagal dibuatkan URL akan diabaikan agar halaman tetap tampil.
 */
export async function getSignedStorageUrls(
  bucket: string,
  paths: string[],
  expiresIn = 60 * 60
): Promise<Map<string, string>> {
  const uniquePaths = [...new Set(paths.filter(Boolean))]
  if (uniquePaths.length === 0) return new Map()

  const { data, error } = await getAdminClient()
    .storage.from(bucket)
    .createSignedUrls(uniquePaths, expiresIn)

  if (error) {
    console.error(
      `[storage] gagal membuat signed URL untuk bucket ${bucket}:`,
      error.message
    )
    return new Map()
  }

  return new Map(
    (data ?? []).flatMap((item) =>
      item.path && item.signedUrl
        ? [[item.path, item.signedUrl] as [string, string]]
        : []
    )
  )
}
