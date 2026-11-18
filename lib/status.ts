import type { MechanicStatus, TransactionStatus } from "@/lib/types"

export const TRANSACTION_STATUS_OPTIONS: {
  value: TransactionStatus
  label: string
}[] = [
  { value: "requested", label: "Menunggu Montir" },
  { value: "matching", label: "Mencari Montir" },
  { value: "mechanic_assigned", label: "Montir Ditugaskan" },
  { value: "mechanic_accepted", label: "Diterima Montir" },
  { value: "on_the_way", label: "Dalam Perjalanan" },
  { value: "arrived", label: "Montir Tiba" },
  { value: "diagnosing", label: "Diagnosa" },
  { value: "repairing", label: "Perbaikan" },
  { value: "completed", label: "Selesai" },
  { value: "payment", label: "Menunggu Pembayaran" },
  { value: "paid", label: "Lunas" },
  { value: "cancelled", label: "Dibatalkan" },
]

export function getTransactionStatusMeta(status: TransactionStatus) {
  const option = TRANSACTION_STATUS_OPTIONS.find((item) => item.value === status)

  const className =
    status === "paid"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : status === "completed"
        ? "bg-sky-500/10 text-sky-700 dark:text-sky-400"
        : status === "payment"
          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
          : status === "cancelled"
            ? "bg-destructive/10 text-destructive"
            : status === "requested" || status === "matching"
              ? "bg-muted text-muted-foreground"
              : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"

  return {
    label: option?.label ?? status,
    className,
  }
}

export function getMechanicStatusMeta(status: MechanicStatus) {
  return status === "ACTIVE"
    ? {
        label: "Aktif",
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      }
    : {
        label: "Menunggu Verifikasi",
        className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
      }
}

export function getPaymentMethodLabel(method: string | null | undefined) {
  const labels: Record<string, string> = {
    qris: "QRIS",
    gopay: "GoPay",
    dana: "DANA",
    transfer: "Transfer Bank",
    cash: "Tunai",
    other: "Lainnya",
  }
  return method ? (labels[method] ?? method) : "—"
}

export function getPaymentStatusLabel(status: string | null | undefined) {
  const labels: Record<string, string> = {
    pending: "Menunggu",
    paid: "Lunas",
    failed: "Gagal",
    expired: "Kedaluwarsa",
    cancelled: "Dibatalkan",
    refunded: "Dikembalikan",
  }
  return status ? (labels[status] ?? status) : "—"
}
