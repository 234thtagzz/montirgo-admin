export type MechanicStatus = "PENDING" | "ACTIVE"

export type Mechanic = {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  workshopName: string | null
  location: string
  status: MechanicStatus
  isOnline: boolean
  rating: number
  totalJobs: number
  joinedAt: string
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

export type PaginatedResult<T> = {
  rows: T[]
  total: number
  page: number
  pageCount: number
}
