import "server-only"

import { requireAdmin } from "@/lib/auth"
import { getAdminClient } from "@/lib/supabase/admin"
import { MECHANICS_PAGE_SIZE } from "@/lib/constants"
import {
  formatCoordinate,
  sanitizeSearch,
} from "@/lib/format"
import type {
  Mechanic,
  MechanicStatus,
  PaginatedResult,
} from "@/lib/types"

export type MechanicStatusFilter = "all" | "pending" | "active"

type RawMechanicRow = {
  profile_id: string
  workshop_name: string | null
  workshop_address: string | null
  is_verified: boolean
  is_online: boolean
  rating_avg: number
  total_jobs: number
  current_lat: number | null
  current_lng: number | null
  created_at: string
  profiles: {
    id: string
    full_name: string | null
    email: string | null
    phone_number: string | null
  }
}

export type MechanicsResult = PaginatedResult<Mechanic> & {
  pendingCount: number
}

export async function getMechanics({
  query = "",
  status = "all",
  page = 1,
}: {
  query?: string
  status?: MechanicStatusFilter
  page?: number
}): Promise<MechanicsResult> {
  // service_role membypass RLS: guard wajib di lapisan data.
  await requireAdmin()

  const db = getAdminClient()
  const search = sanitizeSearch(query)
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const from = (safePage - 1) * MECHANICS_PAGE_SIZE
  const to = from + MECHANICS_PAGE_SIZE - 1

  // Pencarian nama/telepon dilakukan di tabel profiles agar tidak bergantung
  // pada sintaks filter relasi PostgREST yang berbeda antar versi.
  let matchedIds: string[] | null = null
  if (search) {
    const { data: matches, error: matchError } = await db
      .from("profiles")
      .select("id")
      .eq("role", "mechanic")
      .or(`full_name.ilike.%${search}%,phone_number.ilike.%${search}%`)
      .limit(200)

    if (matchError) throw new Error(`Gagal mencari montir: ${matchError.message}`)
    matchedIds = (matches ?? []).map((row) => row.id)

    if (matchedIds.length === 0) {
      return {
        rows: [],
        total: 0,
        page: 1,
        pageCount: 1,
        pendingCount: await getPendingMechanicCount(),
      }
    }
  }

  let mechanicQuery = db
    .from("mechanic_profiles")
    .select(
      `profile_id, workshop_name, workshop_address, is_verified, is_online,
       rating_avg, total_jobs, current_lat, current_lng, created_at,
       profiles!mechanic_profiles_profile_id_fkey!inner(id, full_name, email, phone_number)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to)

  if (status === "pending") mechanicQuery = mechanicQuery.eq("is_verified", false)
  if (status === "active") mechanicQuery = mechanicQuery.eq("is_verified", true)
  if (matchedIds) mechanicQuery = mechanicQuery.in("profile_id", matchedIds)

  const [mechanicsResponse, pendingCount] = await Promise.all([
    mechanicQuery.returns<RawMechanicRow[]>(),
    getPendingMechanicCount(),
  ])

  if (mechanicsResponse.error) {
    throw new Error(`Gagal memuat montir: ${mechanicsResponse.error.message}`)
  }

  const total = mechanicsResponse.count ?? 0

  return {
    rows: (mechanicsResponse.data ?? []).map(mapMechanic),
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / MECHANICS_PAGE_SIZE)),
    pendingCount,
  }
}

async function getPendingMechanicCount(): Promise<number> {
  const { count, error } = await getAdminClient()
    .from("mechanic_profiles")
    .select("profile_id", { count: "exact", head: true })
    .eq("is_verified", false)

  if (error) return 0
  return count ?? 0
}

function mapMechanic(row: RawMechanicRow): Mechanic {
  const status: MechanicStatus = row.is_verified ? "ACTIVE" : "PENDING"
  const coordinate = formatCoordinate(row.current_lat, row.current_lng)

  return {
    id: row.profile_id,
    fullName: row.profiles.full_name?.trim() || "Tanpa Nama",
    email: row.profiles.email,
    phone: row.profiles.phone_number,
    workshopName: row.workshop_name?.trim() || null,
    location: row.workshop_address?.trim() || coordinate || "Belum diisi",
    status,
    isOnline: row.is_online,
    rating: Number(row.rating_avg ?? 0),
    totalJobs: row.total_jobs ?? 0,
    joinedAt: row.created_at,
  }
}
