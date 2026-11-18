import { Suspense } from "react"
import {
  AlertTriangle,
  ReceiptText,
  UserRound,
} from "lucide-react"

import { DataTable, type DataTableColumn } from "@/components/data-table/data-table"
import { EmptyState } from "@/components/data-table/empty-state"
import { FilterBar } from "@/components/data-table/filter-bar"
import { TablePagination } from "@/components/data-table/table-pagination"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { requireAdmin } from "@/lib/auth"
import {
  HIGH_TRANSACTION_TOTAL,
  TRANSACTIONS_PAGE_SIZE,
} from "@/lib/constants"
import { formatDateTime, formatIDR, formatShortId } from "@/lib/format"
import { getTransactions } from "@/lib/queries/transactions"
import { getTransactionStatusMeta } from "@/lib/status"
import type { Transaction } from "@/lib/types"

import { TransactionDetailDialog } from "./transaction-detail-dialog"
import { TRANSACTION_STATUS_FILTER_OPTIONS } from "./status-options"

export const metadata = {
  title: "Transaksi",
}

type SearchParams = {
  q?: string
  status?: string
  page?: string
}

export default function TransaksiPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  return (
    <>
      <PageHeader
        title="Pemantauan Transaksi"
        description="Pantau order terbaru dan buka invoice terperinci untuk memeriksa kewajaran harga jasa maupun sparepart."
      />

      <Suspense fallback={<TransactionsSkeleton />}>
        <TransactionsSection searchParams={searchParams} />
      </Suspense>
    </>
  )
}

async function TransactionsSection({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  await requireAdmin()

  const params = await searchParams
  const query = typeof params.q === "string" ? params.q : ""
  const status =
    typeof params.status === "string" &&
    TRANSACTION_STATUS_FILTER_OPTIONS.some((option) => option.value === params.status)
      ? params.status
      : "all"
  const page = Number(params.page) > 0 ? Number(params.page) : 1

  const result = await getTransactions({ query, status, page })

  const columns: DataTableColumn<Transaction>[] = [
    {
      id: "transaction",
      header: "Transaksi",
      cell: (transaction) => (
        <div className="space-y-0.5">
          <p
            className="font-mono text-xs font-medium"
            title={`UUID: ${transaction.id}`}
          >
            {formatShortId(transaction.id)}
          </p>
          <p className="text-[11px] whitespace-nowrap text-muted-foreground">
            {formatDateTime(transaction.createdAt)}
          </p>
        </div>
      ),
    },
    {
      id: "client",
      header: "Client & Masalah",
      cell: (transaction) => (
        <div className="max-w-72 space-y-0.5">
          <p className="flex items-center gap-1.5 text-sm font-medium">
            <UserRound className="size-3.5 text-muted-foreground" />
            {transaction.clientName}
          </p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {transaction.issue}
          </p>
        </div>
      ),
    },
    {
      id: "mechanic",
      header: "Montir",
      className: "hidden lg:table-cell",
      cell: (transaction) =>
        transaction.mechanicName ? (
          <div className="space-y-0.5">
            <p className="text-sm">{transaction.mechanicName}</p>
            <p className="text-[11px] text-muted-foreground">
              {transaction.mechanicPhone ?? "—"}
            </p>
          </div>
        ) : (
          <Badge variant="outline" className="text-[10px] text-muted-foreground">
            Belum ditugaskan
          </Badge>
        ),
    },
    {
      id: "total",
      header: "Total",
      className: "whitespace-nowrap",
      cell: (transaction) => {
        const flagged = transaction.total >= HIGH_TRANSACTION_TOTAL
        return (
          <div className="space-y-0.5">
            <p className="text-sm font-medium tabular-nums">
              {transaction.total > 0 ? formatIDR(transaction.total) : "—"}
            </p>
            {flagged ? (
              <p
                className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400"
                title="Nilai invoice di atas ambang pemantauan"
              >
                <AlertTriangle className="size-3" />
                Perlu ditinjau
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                {transaction.items.length} item
              </p>
            )}
          </div>
        )
      },
    },
    {
      id: "status",
      header: "Status",
      cell: (transaction) => {
        const meta = getTransactionStatusMeta(transaction.status)
        return (
          <Badge variant="secondary" className={meta.className}>
            {meta.label}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: <span className="sr-only">Aksi</span>,
      className: "w-24 text-right",
      cell: (transaction) => (
        <TransactionDetailDialog transaction={transaction} />
      ),
    },
  ]

  const filterParams: Record<string, string> = {}
  if (query) filterParams.q = query
  if (status !== "all") filterParams.status = status

  return (
    <>
      <FilterBar
        basePath="/transaksi"
        query={query}
        status={status}
        placeholder="Cari UUID transaksi atau keluhan client…"
        statusOptions={TRANSACTION_STATUS_FILTER_OPTIONS}
      />

      <DataTable
        columns={columns}
        rows={result.rows}
        getRowKey={(transaction) => transaction.id}
        label="Daftar transaksi"
        empty={
          <EmptyState
            icon={ReceiptText}
            title="Tidak ada transaksi ditemukan"
            description={
              query || status !== "all"
                ? "Coba ubah kata kunci atau filter status."
                : "Transaksi baru dari aplikasi client akan muncul di sini."
            }
          />
        }
      />

      <TablePagination
        basePath="/transaksi"
        page={result.page}
        pageCount={result.pageCount}
        total={result.total}
        pageSize={TRANSACTIONS_PAGE_SIZE}
        params={filterParams}
      />
    </>
  )
}

function TransactionsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-14 w-full rounded-xl" />
      <div className="space-y-px overflow-hidden rounded-xl border">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-none" />
        ))}
      </div>
    </div>
  )
}
