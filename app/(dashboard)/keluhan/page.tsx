import { Suspense } from "react"
import { MessageSquareWarning, Wrench } from "lucide-react"

import { DataTable, type DataTableColumn } from "@/components/data-table/data-table"
import { EmptyState } from "@/components/data-table/empty-state"
import { FilterBar } from "@/components/data-table/filter-bar"
import { TablePagination } from "@/components/data-table/table-pagination"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { requireAdmin } from "@/lib/auth"
import { COMPLAINTS_PAGE_SIZE } from "@/lib/constants"
import {
  formatDateTime,
  formatPhone,
  formatShortId,
} from "@/lib/format"
import { getComplaints } from "@/lib/queries/complaints"
import {
  COMPLAINT_STATUS_OPTIONS,
  getComplaintCategoryLabel,
  getComplaintStatusMeta,
  getReporterRoleMeta,
  getTransactionStatusMeta,
} from "@/lib/status"
import type { Complaint, TransactionStatus } from "@/lib/types"

import { ComplaintDetailDialog } from "./complaint-detail-dialog"

export const metadata = {
  title: "Keluhan",
}

const COMPLAINT_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Semua status" },
  ...COMPLAINT_STATUS_OPTIONS,
]

type SearchParams = {
  q?: string
  status?: string
  page?: string
}

export default function KeluhanPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  return (
    <>
      <PageHeader
        title="Keluhan"
        description="Tampilkan semua keluhan yang diajukan client maupun montir beserta transaksi, lampiran foto, dan balasan admin."
      />

      <Suspense fallback={<ComplaintsSkeleton />}>
        <ComplaintsSection searchParams={searchParams} />
      </Suspense>
    </>
  )
}

async function ComplaintsSection({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  await requireAdmin()

  const params = await searchParams
  const query = typeof params.q === "string" ? params.q : ""
  const status =
    typeof params.status === "string" &&
    COMPLAINT_STATUS_FILTER_OPTIONS.some(
      (option) => option.value === params.status
    )
      ? params.status
      : "all"
  const page = Number(params.page) > 0 ? Number(params.page) : 1

  const result = await getComplaints({ query, status, page })

  const columns: DataTableColumn<Complaint>[] = [
    {
      id: "complaint",
      header: "Keluhan",
      cell: (complaint) => (
        <div className="max-w-80 space-y-1">
          <p className="line-clamp-1 text-sm font-medium">{complaint.subject}</p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {complaint.description}
          </p>
          <p className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
            <Badge variant="outline" className="text-[10px]">
              {getComplaintCategoryLabel(complaint.category)}
            </Badge>
            <span className="font-mono">{formatShortId(complaint.id)}</span>
            <span>·</span>
            <span>{formatDateTime(complaint.createdAt)}</span>
          </p>
        </div>
      ),
    },
    {
      id: "reporter",
      header: "Pelapor",
      cell: (complaint) => {
        const role = getReporterRoleMeta(complaint.reporterRole)
        return (
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              {complaint.reporterRole === "mechanic" ? (
                <Wrench className="size-3.5 text-muted-foreground" />
              ) : null}
              {complaint.reporterName}
            </p>
            <Badge variant="secondary" className={role.className}>
              {role.label}
            </Badge>
            <p className="text-[11px] text-muted-foreground">
              {formatPhone(complaint.reporterPhone)}
            </p>
          </div>
        )
      },
    },
    {
      id: "order",
      header: "Transaksi",
      className: "hidden lg:table-cell",
      cell: (complaint) => {
        const orderStatus = getTransactionStatusMeta(
          complaint.orderStatus as TransactionStatus
        )
        return (
          <div className="max-w-64 space-y-1">
            <p className="font-mono text-xs font-medium">
              {formatShortId(complaint.requestId)}
            </p>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {complaint.orderIssue}
            </p>
            <Badge variant="secondary" className={orderStatus.className}>
              {orderStatus.label}
            </Badge>
          </div>
        )
      },
    },
    {
      id: "status",
      header: "Status",
      cell: (complaint) => {
        const meta = getComplaintStatusMeta(complaint.status)
        return (
          <div className="space-y-1">
            <Badge variant="secondary" className={meta.className}>
              {meta.label}
            </Badge>
            <p className="text-[11px] text-muted-foreground">
              {complaint.adminReply ? "Sudah dibalas" : "Belum dibalas"}
            </p>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: <span className="sr-only">Aksi</span>,
      className: "w-24 text-right",
      cell: (complaint) => (
        <ComplaintDetailDialog complaint={complaint} />
      ),
    },
  ]

  const filterParams: Record<string, string> = {}
  if (query) filterParams.q = query
  if (status !== "all") filterParams.status = status

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{result.total} keluhan</Badge>
      </div>

      <FilterBar
        basePath="/keluhan"
        query={query}
        status={status}
        placeholder="Cari judul, deskripsi, nama pelapor, atau UUID…"
        statusOptions={COMPLAINT_STATUS_FILTER_OPTIONS}
      />

      <DataTable
        columns={columns}
        rows={result.rows}
        getRowKey={(complaint) => complaint.id}
        label="Daftar keluhan"
        empty={
          <EmptyState
            icon={MessageSquareWarning}
            title="Tidak ada keluhan ditemukan"
            description={
              query || status !== "all"
                ? "Coba ubah kata kunci atau filter status."
                : "Keluhan baru dari client maupun montir akan muncul di sini."
            }
          />
        }
      />

      <TablePagination
        basePath="/keluhan"
        page={result.page}
        pageCount={result.pageCount}
        total={result.total}
        pageSize={COMPLAINTS_PAGE_SIZE}
        params={filterParams}
      />
    </>
  )
}

function ComplaintsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-14 w-full rounded-xl" />
      <div className="space-y-px overflow-hidden rounded-xl border">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-none" />
        ))}
      </div>
    </div>
  )
}
