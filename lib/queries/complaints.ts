import "server-only"

import { requireAdmin } from "@/lib/auth"
import { COMPLAINTS_PAGE_SIZE } from "@/lib/constants"
import { isUuid, sanitizeSearch } from "@/lib/format"
import { COMPLAINT_STATUS_OPTIONS } from "@/lib/status"
import { getAdminClient } from "@/lib/supabase/admin"
import { getSignedStorageUrls } from "@/lib/supabase/storage"
import type {
  Complaint,
  ComplaintCategory,
  ComplaintReporterRole,
  ComplaintStatus,
  PaginatedResult,
} from "@/lib/types"

const VALID_STATUSES = new Set<string>(
  COMPLAINT_STATUS_OPTIONS.map((option) => option.value)
)

const VALID_CATEGORIES = new Set<string>([
  "pesanan",
  "pembayaran",
  "montir",
  "aplikasi",
  "lainnya",
])

const COMPLAINT_PHOTO_BUCKET = "complaint-photos"

type RawComplaintRow = {
  id: string
  reporter_id: string
  reporter_role: string
  category: string
  subject: string
  description: string
  photo_paths: string[]
  status: string
  admin_reply: string | null
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
  updated_at: string
  request_id: string
  reporter: {
    id: string
    full_name: string | null
    email: string | null
    phone_number: string | null
  } | null
  resolver: {
    id: string
    full_name: string | null
  } | null
  request: {
    id: string
    status: string
    issue_description: string
    created_at: string
  } | null
}

export type ComplaintsResult = PaginatedResult<Complaint>

export async function getComplaints({
  query = "",
  status = "all",
  page = 1,
}: {
  query?: string
  status?: string
  page?: number
}): Promise<ComplaintsResult> {
  // service_role membypass RLS: guard wajib di lapisan data.
  await requireAdmin()

  const db = getAdminClient()
  const search = sanitizeSearch(query)
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const from = (safePage - 1) * COMPLAINTS_PAGE_SIZE
  const to = from + COMPLAINTS_PAGE_SIZE - 1

  // View `admin_complaint_overview` memakai `where has_role('admin')`, sedangkan
  // service_role tidak punya auth.uid(). Karena itu data dibaca dari tabel
  // `complaints` lalu direlasikan langsung ke profil dan transaksi.
  let complaintQuery = db
    .from("complaints")
    .select(
      `id, reporter_id, reporter_role, category, subject, description, photo_paths,
       status, admin_reply, resolved_at, resolved_by, created_at, updated_at, request_id,
       reporter:profiles!complaints_reporter_id_fkey(id, full_name, email, phone_number),
       resolver:profiles!complaints_resolved_by_fkey(id, full_name),
       request:service_requests!complaints_request_id_fkey(id, status, issue_description, created_at)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to)

  if (status !== "all" && VALID_STATUSES.has(status)) {
    complaintQuery = complaintQuery.eq("status", status)
  }

  if (search) {
    if (isUuid(search)) {
      complaintQuery = complaintQuery.or(
        `id.eq.${search},request_id.eq.${search}`
      )
    } else {
      // Pencarian nama/email/telepon pelapor dilakukan di tabel profiles agar
      // tidak bergantung pada sintaks filter relasi PostgREST.
      const { data: matches, error: matchError } = await db
        .from("profiles")
        .select("id")
        .or(
          `full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%`
        )
        .limit(200)

      if (matchError) {
        throw new Error(`Gagal mencari pelapor: ${matchError.message}`)
      }

      const reporterIds = (matches ?? []).map((row) => row.id)
      const conditions = [
        `subject.ilike.%${search}%`,
        `description.ilike.%${search}%`,
      ]

      if (reporterIds.length > 0) {
        conditions.push(`reporter_id.in.(${reporterIds.join(",")})`)
      }

      complaintQuery = complaintQuery.or(conditions.join(","))
    }
  }

  const { data, count, error } =
    await complaintQuery.returns<RawComplaintRow[]>()

  if (error) {
    throw new Error(`Gagal memuat keluhan: ${error.message}`)
  }

  const rows = data ?? []
  const photoUrls = await getSignedStorageUrls(
    COMPLAINT_PHOTO_BUCKET,
    rows.flatMap((row) => row.photo_paths ?? [])
  )
  const total = count ?? 0

  return {
    rows: rows.map((row) => mapComplaint(row, photoUrls)),
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / COMPLAINTS_PAGE_SIZE)),
  }
}

function mapComplaint(
  row: RawComplaintRow,
  photoUrls: Map<string, string>
): Complaint {
  const status = VALID_STATUSES.has(row.status)
    ? (row.status as ComplaintStatus)
    : "open"
  const category = VALID_CATEGORIES.has(row.category)
    ? (row.category as ComplaintCategory)
    : "lainnya"
  const reporterRole: ComplaintReporterRole =
    row.reporter_role === "mechanic" ? "mechanic" : "client"

  return {
    id: row.id,
    subject: row.subject,
    description: row.description,
    category,
    status,
    reporterId: row.reporter_id,
    reporterName: row.reporter?.full_name?.trim() || "Tanpa Nama",
    reporterEmail: row.reporter?.email ?? null,
    reporterPhone: row.reporter?.phone_number ?? null,
    reporterRole,
    requestId: row.request_id,
    orderIssue: row.request?.issue_description ?? "Transaksi tidak ditemukan",
    orderStatus: row.request?.status ?? "unknown",
    orderCreatedAt: row.request?.created_at ?? row.created_at,
    photoUrls: (row.photo_paths ?? [])
      .map((path) => photoUrls.get(path))
      .filter((url): url is string => Boolean(url)),
    adminReply: row.admin_reply,
    resolvedAt: row.resolved_at,
    resolvedByName: row.resolver?.full_name?.trim() || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
