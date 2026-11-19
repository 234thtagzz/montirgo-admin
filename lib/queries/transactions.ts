import "server-only"

import { requireAdmin } from "@/lib/auth"
import { TRANSACTIONS_PAGE_SIZE } from "@/lib/constants"
import { isUuid, sanitizeSearch } from "@/lib/format"
import { TRANSACTION_STATUS_OPTIONS } from "@/lib/status"
import { getAdminClient } from "@/lib/supabase/admin"
import type {
  InvoiceItem,
  PaginatedResult,
  Transaction,
  TransactionPayment,
  TransactionStatus,
} from "@/lib/types"

const VALID_STATUSES = new Set<string>(
  TRANSACTION_STATUS_OPTIONS.map((option) => option.value)
)

type RawPayment = {
  id: string
  amount: number
  method: string
  status: string
  paid_at: string | null
}

type RawInvoiceItem = {
  id: string
  keterangan: string
  harga: number
  created_at: string
}

type RawTransactionRow = {
  id: string
  status: string
  issue_description: string
  address: string | null
  price_amount: number | null
  created_at: string
  client: {
    id: string
    full_name: string | null
    phone_number: string | null
  } | null
  mechanic: {
    id: string
    full_name: string | null
    phone_number: string | null
  } | null
  payments: RawPayment | RawPayment[] | null
  order_invoice_items: RawInvoiceItem[] | null
}

export type TransactionsResult = PaginatedResult<Transaction>

export async function getTransactions({
  query = "",
  status = "all",
  page = 1,
}: {
  query?: string
  status?: string
  page?: number
}): Promise<TransactionsResult> {
  // service_role membypass RLS: guard wajib di lapisan data.
  await requireAdmin()

  const db = getAdminClient()
  const search = sanitizeSearch(query)
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const from = (safePage - 1) * TRANSACTIONS_PAGE_SIZE
  const to = from + TRANSACTIONS_PAGE_SIZE - 1

  let requestQuery = db
    .from("service_requests")
    .select(
      `id, status, issue_description, address, price_amount, created_at,
       client:profiles!service_requests_client_id_fkey(id, full_name, phone_number),
       mechanic:profiles!service_requests_mechanic_id_fkey(id, full_name, phone_number),
       payments(id, amount, method, status, paid_at),
       order_invoice_items(id, keterangan, harga, created_at)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .order("created_at", {
      referencedTable: "order_invoice_items",
      ascending: true,
    })
    .range(from, to)

  if (status !== "all" && VALID_STATUSES.has(status)) {
    requestQuery = requestQuery.eq("status", status)
  }

  if (search) {
    requestQuery = isUuid(search)
      ? requestQuery.eq("id", search)
      : requestQuery.ilike("issue_description", `%${search}%`)
  }

  const { data, count, error } = await requestQuery.returns<RawTransactionRow[]>()

  if (error) {
    throw new Error(`Gagal memuat transaksi: ${error.message}`)
  }

  const total = count ?? 0

  return {
    rows: (data ?? []).map(mapTransaction),
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / TRANSACTIONS_PAGE_SIZE)),
  }
}

function mapTransaction(row: RawTransactionRow): Transaction {
  const items: InvoiceItem[] = (row.order_invoice_items ?? [])
    .map((item) => ({
      id: item.id,
      description: item.keterangan,
      amount: item.harga,
      createdAt: item.created_at,
    }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

  const paymentRows = normalizePayments(row.payments)
  const paidPayment = paymentRows.find((payment) => payment.status === "paid")
  const itemsTotal = items.reduce((sum, item) => sum + item.amount, 0)
  const total = items.length > 0 ? itemsTotal : (paidPayment?.amount ?? row.price_amount ?? 0)

  return {
    id: row.id,
    status: (VALID_STATUSES.has(row.status)
      ? row.status
      : "requested") as TransactionStatus,
    issue: row.issue_description,
    address: row.address,
    clientName: row.client?.full_name?.trim() || "Client",
    clientPhone: row.client?.phone_number ?? null,
    mechanicName: row.mechanic?.full_name?.trim() || null,
    mechanicPhone: row.mechanic?.phone_number ?? null,
    total,
    createdAt: row.created_at,
    items,
    payment: toPayment(paidPayment ?? paymentRows[0]),
  }
}

function normalizePayments(
  value: RawPayment | RawPayment[] | null
): RawPayment[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function toPayment(payment: RawPayment | undefined): TransactionPayment | null {
  if (!payment) return null
  return {
    id: payment.id,
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    paidAt: payment.paid_at,
  }
}
