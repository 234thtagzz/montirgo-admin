import { Suspense } from "react"
import {
  BadgeCheck,
  Briefcase,
  MapPin,
  Phone,
  Wrench,
} from "lucide-react"

import { DataTable, type DataTableColumn } from "@/components/data-table/data-table"
import { EmptyState } from "@/components/data-table/empty-state"
import { FilterBar } from "@/components/data-table/filter-bar"
import { TablePagination } from "@/components/data-table/table-pagination"
import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { requireAdmin } from "@/lib/auth"
import { MECHANICS_PAGE_SIZE } from "@/lib/constants"
import {
  formatDate,
  formatPhone,
  getInitials,
} from "@/lib/format"
import {
  getMechanics,
  type MechanicStatusFilter,
} from "@/lib/queries/mechanics"
import { getMechanicStatusMeta } from "@/lib/status"
import type { Mechanic } from "@/lib/types"

import { MechanicDetailDialog } from "./mechanic-detail-dialog"
import { VerifyMechanicButton } from "./verify-mechanic-button"

export const metadata = {
  title: "Montir",
}

type SearchParams = {
  q?: string
  status?: string
  page?: string
}

export default function MontirPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  return (
    <>
      <PageHeader
        title="Manajemen Montir"
        description="Tinjau montir baru, verifikasi profil, dan pantau montir yang sedang aktif menerima order."
      />

      <Suspense fallback={<MontirSkeleton />}>
        <MechanicsSection searchParams={searchParams} />
      </Suspense>
    </>
  )
}

async function MechanicsSection({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  await requireAdmin()

  const params = await searchParams
  const query = typeof params.q === "string" ? params.q : ""
  const status: MechanicStatusFilter =
    params.status === "pending" || params.status === "active"
      ? params.status
      : "all"
  const page = Number(params.page) > 0 ? Number(params.page) : 1

  const result = await getMechanics({ query, status, page })

  const columns: DataTableColumn<Mechanic>[] = [
    {
      id: "mechanic",
      header: "Montir",
      cell: (mechanic) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            {mechanic.avatarUrl ? (
              <AvatarImage src={mechanic.avatarUrl} alt={mechanic.fullName} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
              {getInitials(mechanic.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-medium">{mechanic.fullName}</p>
              {mechanic.isOnline ? (
                <span
                  className="size-1.5 shrink-0 rounded-full bg-emerald-500"
                  title="Sedang online"
                />
              ) : null}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {mechanic.workshopName ?? "Montir panggilan"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Bergabung {formatDate(mechanic.joinedAt)}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Kontak",
      cell: (mechanic) => (
        <div className="space-y-0.5">
          <p className="flex items-center gap-1.5 text-xs">
            <Phone className="size-3 text-muted-foreground" />
            {formatPhone(mechanic.phone)}
          </p>
          <p className="max-w-48 truncate text-xs text-muted-foreground">
            {mechanic.email ?? "Tanpa email"}
          </p>
        </div>
      ),
    },
    {
      id: "profile",
      header: "Profil",
      className: "hidden xl:table-cell",
      cell: (mechanic) => (
        <div className="space-y-1 text-xs whitespace-normal">
          <p className="flex items-center gap-1.5">
            <Briefcase className="size-3 text-muted-foreground" />
            {mechanic.experienceYears !== null
              ? `${mechanic.experienceYears} tahun pengalaman`
              : "Pengalaman belum diisi"}
          </p>
          <p className="text-muted-foreground">
            {mechanic.skills.length} keahlian ·{" "}
            {mechanic.certifications.length} sertifikasi
          </p>
          <p className="text-muted-foreground">
            {mechanic.workshopPhotoUrls.length} foto bengkel ·{" "}
            <span
              className={
                mechanic.identityNumber
                  ? undefined
                  : "text-amber-700 dark:text-amber-400"
              }
            >
              identitas {mechanic.identityNumber ? "terisi" : "belum diisi"}
            </span>
          </p>
        </div>
      ),
    },
    {
      id: "location",
      header: "Lokasi",
      className: "hidden lg:table-cell",
      cell: (mechanic) => (
        <p className="flex max-w-56 items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 size-3 shrink-0" />
          <span className="line-clamp-2">{mechanic.location}</span>
        </p>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (mechanic) => {
        const meta = getMechanicStatusMeta(mechanic.status)
        return (
          <div className="space-y-1">
            <Badge variant="secondary" className={meta.className}>
              {meta.label}
            </Badge>
            <p className="text-[11px] text-muted-foreground">
              {mechanic.rating > 0
                ? `★ ${mechanic.rating.toFixed(1)} · ${mechanic.totalJobs} order`
                : "Belum ada rating"}
            </p>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: <span className="sr-only">Aksi</span>,
      className: "w-52 text-right",
      cell: (mechanic) => (
        <div className="flex items-center justify-end gap-2">
          <MechanicDetailDialog mechanic={mechanic} />
          {mechanic.status === "PENDING" ? (
            <VerifyMechanicButton
              mechanicId={mechanic.id}
              mechanicName={mechanic.fullName}
            />
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <BadgeCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              Terverifikasi
            </span>
          )}
        </div>
      ),
    },
  ]

  const filterParams: Record<string, string> = {}
  if (query) filterParams.q = query
  if (status !== "all") filterParams.status = status

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{result.total} montir</Badge>
        {result.pendingCount > 0 ? (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
            {result.pendingCount} menunggu verifikasi
          </Badge>
        ) : null}
      </div>

      <FilterBar
        basePath="/montir"
        query={query}
        status={status}
        placeholder="Cari nama atau nomor HP montir…"
        statusOptions={[
          { value: "all", label: "Semua status" },
          { value: "pending", label: "Menunggu verifikasi" },
          { value: "active", label: "Aktif" },
        ]}
      />

      <DataTable
        columns={columns}
        rows={result.rows}
        getRowKey={(mechanic) => mechanic.id}
        label="Daftar montir"
        empty={
          <EmptyState
            icon={Wrench}
            title="Tidak ada montir ditemukan"
            description={
              query || status !== "all"
                ? "Coba ubah kata kunci atau filter status."
                : "Montir yang mendaftar lewat aplikasi akan muncul di sini."
            }
          />
        }
      />

      <TablePagination
        basePath="/montir"
        page={result.page}
        pageCount={result.pageCount}
        total={result.total}
        pageSize={MECHANICS_PAGE_SIZE}
        params={filterParams}
      />
    </>
  )
}

function MontirSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-14 w-full rounded-xl" />
      <div className="space-y-px overflow-hidden rounded-xl border">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-none" />
        ))}
      </div>
    </div>
  )
}
