import "server-only"

import { requireAdmin } from "@/lib/auth"
import { getAdminClient } from "@/lib/supabase/admin"
import { getSignedStorageUrls } from "@/lib/supabase/storage"
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

const WORKSHOP_PHOTO_BUCKET = "workshop-photos"

type RawMechanicRow = {
  profile_id: string
  workshop_name: string | null
  workshop_address: string | null
  is_verified: boolean
  is_available: boolean
  is_online: boolean
  rating_avg: number
  rating_count: number
  total_jobs: number
  current_lat: number | null
  current_lng: number | null
  last_location_at: string | null
  bio: string | null
  experience_years: number | null
  skills: string[] | null
  vehicle_specialization: string[] | null
  certifications: string[] | null
  identity_number: string | null
  workshop_photos: string[] | null
  verified_at: string | null
  created_at: string
  updated_at: string
  profiles: {
    id: string
    full_name: string | null
    email: string | null
    phone_number: string | null
    avatar_url: string | null
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
      `profile_id, workshop_name, workshop_address, is_verified, is_available, is_online,
       rating_avg, rating_count, total_jobs, current_lat, current_lng, last_location_at,
       bio, experience_years, skills, vehicle_specialization, certifications,
       identity_number, workshop_photos, verified_at, created_at, updated_at,
       profiles!mechanic_profiles_profile_id_fkey!inner(id, full_name, email, phone_number, avatar_url)`,
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
  const rows = mechanicsResponse.data ?? []
  const workshopPhotoUrls = await getSignedStorageUrls(
    WORKSHOP_PHOTO_BUCKET,
    rows.flatMap((row) => row.workshop_photos ?? [])
  )

  return {
    rows: rows.map((row) => mapMechanic(row, workshopPhotoUrls)),
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

function mapMechanic(
  row: RawMechanicRow,
  workshopPhotoUrls: Map<string, string>
): Mechanic {
  const status: MechanicStatus = row.is_verified ? "ACTIVE" : "PENDING"
  const coordinate = formatCoordinate(row.current_lat, row.current_lng)

  return {
    id: row.profile_id,
    fullName: row.profiles.full_name?.trim() || "Tanpa Nama",
    email: row.profiles.email,
    phone: row.profiles.phone_number,
    avatarUrl: row.profiles.avatar_url,
    workshopName: row.workshop_name?.trim() || null,
    workshopAddress: row.workshop_address?.trim() || null,
    location: row.workshop_address?.trim() || coordinate || "Belum diisi",
    coordinate,
    status,
    isOnline: row.is_online,
    isAvailable: row.is_available,
    bio: row.bio?.trim() || null,
    experienceYears: row.experience_years,
    skills: row.skills ?? [],
    specializations: row.vehicle_specialization ?? [],
    certifications: row.certifications ?? [],
    identityNumber: row.identity_number?.trim() || null,
    workshopPhotoUrls: (row.workshop_photos ?? [])
      .map((path) => workshopPhotoUrls.get(path))
      .filter((url): url is string => Boolean(url)),
    rating: Number(row.rating_avg ?? 0),
    ratingCount: row.rating_count ?? 0,
    totalJobs: row.total_jobs ?? 0,
    verifiedAt: row.verified_at,
    lastLocationAt: row.last_location_at,
    joinedAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
