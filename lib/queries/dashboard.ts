import "server-only"

import { startOfTodayJakarta } from "@/lib/format"
import { getAdminClient } from "@/lib/supabase/admin"

export type DashboardStats = {
  totalRevenue: number
  todayRevenue: number
  activeMechanics: number
  onlineMechanics: number
  todayTransactions: number
  pendingMechanics: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = getAdminClient()
  const todayStart = startOfTodayJakarta()

  const [totalRevenue, todayRevenue, active, online, today, pending] =
    await Promise.all([
      sumPaidRevenue(),
      sumPaidRevenue(todayStart),
      db
        .from("mechanic_profiles")
        .select("profile_id", { count: "exact", head: true })
        .eq("is_verified", true),
      db
        .from("mechanic_profiles")
        .select("profile_id", { count: "exact", head: true })
        .eq("is_verified", true)
        .eq("is_online", true),
      db
        .from("service_requests")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayStart),
      db
        .from("mechanic_profiles")
        .select("profile_id", { count: "exact", head: true })
        .eq("is_verified", false),
    ])

  return {
    totalRevenue,
    todayRevenue,
    activeMechanics: active.count ?? 0,
    onlineMechanics: online.count ?? 0,
    todayTransactions: today.count ?? 0,
    pendingMechanics: pending.count ?? 0,
  }
}

async function sumPaidRevenue(since?: string): Promise<number> {
  const db = getAdminClient()

  // Project Supabase ini menonaktifkan aggregate function PostgREST
  // (`amount.sum()` mengembalikan "Use of aggregate functions is not allowed"),
  // jadi penjumlahan dilakukan bertahap di server dengan pagination.
  const PAGE_SIZE = 1000
  let total = 0
  let from = 0

  for (;;) {
    let query = db
      .from("payments")
      .select("amount")
      .eq("status", "paid")
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (since) query = query.gte("paid_at", since)

    const { data, error } = await query

    if (error) {
      // Dashboard tetap tampil walau agregat gagal; detail error dicatat di server.
      console.error("[dashboard] gagal menghitung pendapatan:", error.message)
      return total
    }

    const rows = data ?? []
    total += rows.reduce((sum, row) => sum + Number(row.amount ?? 0), 0)

    if (rows.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return total
}
