// app/(dashboard)/client/page.tsx
import { Suspense } from "react"
import { Mail, Phone, ShoppingBag, Users } from "lucide-react"

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
import { formatDate, formatIDR, formatPhone, getInitials } from "@/lib/format"
import { getClients } from "@/lib/queries/clients"
import type { Client } from "@/lib/types"

import { ClientDetailDialog } from "./client-detail-dialog"

export const metadata = {
  title: "Klien",
}

type SearchParams = {
  q?: string
  page?: string
}

export default function ClientPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  return (
    <>
      <PageHeader
        title="Manajemen Klien"
        description="Lihat seluruh data klien, detail kontak, identitas, dan statistik penggunaan layanan."
      />

      <Suspense fallback={<ClientSkeleton />}>
        <ClientsSection searchParams={searchParams} />
      </Suspense>
    </>
  )
}

async function ClientsSection({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  await requireAdmin()

  const params = await searchParams
  const query = typeof params.q === "string" ? params.q : ""
  const page = Number(params.page) > 0 ? Number(params.page) : 1

  const result = await getClients({ query, page })

  const columns: DataTableColumn<Client>[] = [
    {
      id: "client",
      header: "Klien",
      cell: (client) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            {client.avatarUrl ? (
              <AvatarImage src={client.avatarUrl} alt={client.fullName} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
              {getInitials(client.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{client.fullName}</p>
            <p className="text-[11px] text-muted-foreground">
              Bergabung {formatDate(client.joinedAt)}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Kontak",
      cell: (client) => (
        <div className="space-y-0.5">
          <p className="flex items-center gap-1.5 text-xs">
            <Mail className="size-3 text-muted-foreground" />
            {client.email ?? "—"}
          </p>
          <p className="flex items-center gap-1.5 text-xs">
            <Phone className="size-3 text-muted-foreground" />
            {formatPhone(client.phone)}
          </p>
        </div>
      ),
    },
    {
      id: "identity",
      header: "Identitas",
      className: "hidden md:table-cell",
      cell: (client) => (
        <p
          className={
            client.identityNumber
              ? "text-xs"
              : "text-xs text-amber-700 dark:text-amber-400"
          }
        >
          {client.identityNumber ?? "Belum diisi"}
        </p>
      ),
    },
    {
      id: "stats",
      header: "Statistik",
      className: "hidden lg:table-cell",
      cell: (client) => (
        <div className="space-y-0.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <ShoppingBag className="size-3" />
            {client.totalRequests} order
          </p>
          <p>{formatIDR(client.totalSpent)}</p>
        </div>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">Aksi</span>,
      className: "w-28 text-right",
      cell: (client) => (
        <div className="flex justify-end">
          <ClientDetailDialog client={client} />
        </div>
      ),
    },
  ]

  const filterParams: Record<string, string> = {}
  if (query) filterParams.q = query

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{result.total} klien</Badge>
      </div>

      <FilterBar
        basePath="/client"
        query={query}
        status="all"
        placeholder="Cari nama, email, atau nomor HP klien…"
        statusOptions={[{ value: "all", label: "Semua klien" }]}
      />

      <DataTable
        columns={columns}
        rows={result.rows}
        getRowKey={(client) => client.id}
        label="Daftar klien"
        empty={
          <EmptyState
            icon={Users}
            title="Tidak ada klien ditemukan"
            description={
              query
                ? "Coba ubah kata kunci pencarian."
                : "Klien yang mendaftar lewat aplikasi akan muncul di sini."
            }
          />
        }
      />

      <TablePagination
        basePath="/client"
        page={result.page}
        pageCount={result.pageCount}
        total={result.total}
        pageSize={MECHANICS_PAGE_SIZE}
        params={filterParams}
      />
    </>
  )
}

function ClientSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-14 w-full rounded-xl" />
      <div className="space-y-px overflow-hidden rounded-xl border">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-none" />
        ))}
      </div>
    </div>
  )
}
