import { TRANSACTION_STATUS_OPTIONS } from "@/lib/status"

export const TRANSACTION_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Semua status" },
  ...TRANSACTION_STATUS_OPTIONS,
]
