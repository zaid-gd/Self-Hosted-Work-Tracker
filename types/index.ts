export type ProjectStatus = "PLANNED" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED"
export type PaymentType = "PAID_ADVANCE" | "UNPAID" | "FREE" | "SALARY"

export interface Client {
  id: string
  userId: string
  name: string
  contactEmail: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  userId: string
  title: string
  clientId: string
  client: { id: string; name: string }
  status: ProjectStatus
  paymentType: PaymentType
  agreedAmount: number | null
  currency: string
  isPaid: boolean
  tags: string
  notes: string | null
  createdAt: string
  dueDate: string | null
  completedAt: string | null
  updatedAt: string
}

export interface ProjectAttachment {
  id: string
  userId: string
  projectId: string
  fileName: string
  storagePath: string
  bucket: string
  mimeType: string | null
  sizeBytes: number | null
  createdAt: string
  signedUrl?: string | null
}

export interface ProjectWithClient extends Project {
  client: Client
}

export interface KpiData {
  totalProjects: number
  unpaidCount: number
  freeCount: number
  earnedAmount: number
  currency: string
}

export type SortOption =
  | "createdAt_desc"
  | "createdAt_asc"
  | "dueDate_asc"
  | "agreedAmount_desc"
  | "clientName_asc"
