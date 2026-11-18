export const JAKARTA_TIME_ZONE = "Asia/Jakarta"

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: JAKARTA_TIME_ZONE,
})

const dateOnlyFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeZone: JAKARTA_TIME_ZONE,
})

export function formatIDR(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—"
  return currencyFormatter.format(value)
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : dateOnlyFormatter.format(date)
}

export function formatPhone(value: string | null | undefined): string {
  if (!value) return "—"
  const digits = value.replace(/\D/g, "")
  if (digits.length < 9) return value
  return digits.replace(/(\d{4})(\d{3,4})(\d{3,4})/, "$1-$2-$3")
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "MG"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "MG"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function formatShortId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`
}

export function formatCoordinate(
  lat: number | null | undefined,
  lng: number | null | undefined
): string | null {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return null
  }
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}

/** Awal hari ini di Asia/Jakarta (UTC+7), dalam bentuk ISO string. */
export function startOfTodayJakarta(): string {
  const dateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: JAKARTA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())

  return new Date(`${dateKey}T00:00:00+07:00`).toISOString()
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )
}

/** Membersihkan input user sebelum dimasukkan ke filter PostgREST `.or()`. */
export function sanitizeSearch(value: string): string {
  return value.replace(/[,()%*\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80)
}
