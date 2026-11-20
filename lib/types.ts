export type MechanicStatus = "PENDING" | "ACTIVE"

export type Mechanic = {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  avatarUrl: string | null
  workshopName: string | null
  workshopAddress: string | null
  location: string
  coordinate: string | null
  status: MechanicStatus
  isOnline: boolean
  isAvailable: boolean
  bio: string | null
  experienceYears: number | null
  skills: string[]
  specializations: string[]
  certifications: string[]
  identityNumber: string | null
  workshopPhotoUrls: string[]
  rating: number
  ratingCount: number
  totalJobs: number
  verifiedAt: string | null
  lastLocationAt: string | null
  joinedAt: string
  updatedAt: string
}

export type TransactionStatus =
  | "requested"
  | "matching"
  | "mechanic_assigned"
  | "mechanic_accepted"
  | "on_the_way"
  | "arrived"
  | "diagnosing"
  | "repairing"
  | "completed"
  | "payment"
  | "paid"
  | "cancelled"

export type InvoiceItem = {
  id: string
  description: string
  amount: number
  createdAt: string
}

export type TransactionPayment = {
  id: string
  amount: number
  method: string
  status: string
  paidAt: string | null
}

export type Transaction = {
  id: string
  status: TransactionStatus
  issue: string
  address: string | null
  clientName: string
  clientPhone: string | null
  mechanicName: string | null
  mechanicPhone: string | null
  total: number
  createdAt: string
  items: InvoiceItem[]
  payment: TransactionPayment | null
}

export type ComplaintCategory =
  | "pesanan"
  | "pembayaran"
  | "montir"
  | "aplikasi"
  | "lainnya"

export type ComplaintStatus = "open" | "in_progress" | "resolved" | "closed"

export type ComplaintReporterRole = "client" | "mechanic"

export type Complaint = {
  id: string
  subject: string
  description: string
  category: ComplaintCategory
  status: ComplaintStatus
  reporterId: string
  reporterName: string
  reporterEmail: string | null
  reporterPhone: string | null
  reporterRole: ComplaintReporterRole
  requestId: string
  orderIssue: string
  orderStatus: string
  orderCreatedAt: string
  photoUrls: string[]
  adminReply: string | null
  resolvedAt: string | null
  resolvedByName: string | null
  createdAt: string
  updatedAt: string
}

export type PaginatedResult<T> = {
  rows: T[]
  total: number
  page: number
  pageCount: number
}
