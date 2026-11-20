import "server-only"

import { requireAdmin } from "@/lib/auth"
import { getAdminClient } from "@/lib/supabase/admin"
import { MECHANICS_PAGE_SIZE } from "@/lib/constants"
import { sanitizeSearch } from "@/lib/format"
import type { Client, PaginatedResult } from "@/lib/types"

type RawClientRow = {
  id: string | null
  full_name: string | null
  email: string | null
  phone_number: string | null
  avatar_url: string | null
  identity_number: string | null
  role: string | null
  client_request_count: number | null
  total_spent: number | null
  created_at: string | null
  updated_at: string | null
}

export async function getClients({
  query = "",
  page = 1,
}: {
  query?: string
  page?: number
}): Promise<PaginatedResult<Client> & { total: number }> {
  await requireAdmin()

  const db = getAdminClient()
  const search = sanitizeSearch(query)
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const from = (safePage - 1) * MECHANICS_PAGE_SIZE
  const to = from + MECHANICS_PAGE_SIZE - 1

  let q = db
    .from("admin_user_directory")
    .select("*", { count: "exact" })
    .eq("role", "client")
    .order("created_at", { ascending: false })
    .range(from, to)

  if (search) {
    q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%`)
  }

  const { data, count, error } = await q.returns<RawClientRow[]>()
  if (error) throw new Error(`Gagal memuat klien: ${error.message}`)

  const rows: Client[] = (data ?? []).map((row) => ({
    id: row.id ?? "",
    fullName: row.full_name?.trim() || "Tanpa Nama",
    email: row.email ?? null,
    phone: row.phone_number ?? null,
    avatarUrl: row.avatar_url ?? null,
    identityNumber: row.identity_number?.trim() || null,
    totalRequests: row.client_request_count ?? 0,
    totalSpent: row.total_spent ?? 0,
    joinedAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
  }))

  const total = count ?? 0
  return {
    rows,
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / MECHANICS_PAGE_SIZE)),
  }
}
