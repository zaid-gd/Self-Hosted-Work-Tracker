import { z } from "zod"

export const PROJECT_STATUSES = ["PLANNED", "IN_PROGRESS", "DELIVERED", "CANCELLED"] as const
export const PAYMENT_TYPES = ["PAID_ADVANCE", "UNPAID", "FREE", "SALARY"] as const

export const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  clientId: z.string().min(1, "Client is required"),
  status: z.enum(PROJECT_STATUSES).default("PLANNED"),
  paymentType: z.enum(PAYMENT_TYPES).default("UNPAID"),
  agreedAmount: z.number().positive("Amount must be positive").nullable().optional(),
  currency: z.string().default("INR"),
  isPaid: z.boolean().default(false),
  tags: z.string().optional().default(""),
  notes: z.string().optional(),
  dueDate: z.coerce.date().nullable().optional(),
  completedAt: z.coerce.date().nullable().optional(),
})

export const ClientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  notes: z.string().optional(),
})

export type ProjectInput = z.infer<typeof ProjectSchema>
export type ClientInput = z.infer<typeof ClientSchema>
