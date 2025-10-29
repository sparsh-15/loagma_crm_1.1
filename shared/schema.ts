import { z } from "zod";

// ==================== USER SCHEMA ====================
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  role: z.enum(["admin", "manager", "exec", "accountant", "engineer", "client"]),
  name: z.string(),
});

export const insertUserSchema = userSchema.omit({ id: true });

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// ==================== LEAD SCHEMA ====================
export const leadNoteSchema = z.object({
  text: z.string(),
  timestamp: z.string(),
  user: z.string(),
});

export const leadSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
  source: z.enum(["Website", "Referral", "Cold Call", "Social Media"]),
  status: z.enum(["New", "In Progress", "Converted", "Lost"]),
  assignedTo: z.string(),
  assignedToName: z.string(),
  createdDate: z.string(),
  notes: z.array(leadNoteSchema),
  convertedToClientId: z.number().nullable(),
});

export const insertLeadSchema = leadSchema.omit({ id: true, assignedToName: true, notes: true, convertedToClientId: true }).extend({
  notes: z.array(leadNoteSchema).optional(),
  convertedToClientId: z.number().nullable().optional(),
});

export type Lead = z.infer<typeof leadSchema>;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type LeadNote = z.infer<typeof leadNoteSchema>;

// ==================== CLIENT SCHEMA ====================
export const clientSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
  address: z.string(),
  createdDate: z.string(),
  totalRevenue: z.number(),
  leadId: z.number().nullable(),
});

export const insertClientSchema = clientSchema.omit({ id: true, totalRevenue: true }).extend({
  totalRevenue: z.number().optional(),
});

export type Client = z.infer<typeof clientSchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;

// ==================== QUOTATION SCHEMA ====================
export const quotationItemSchema = z.object({
  description: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  amount: z.number(),
});

export const quotationSchema = z.object({
  id: z.number(),
  quotationNumber: z.string(),
  clientId: z.number(),
  clientName: z.string(),
  items: z.array(quotationItemSchema),
  subtotal: z.number(),
  taxRate: z.number(),
  taxAmount: z.number(),
  total: z.number(),
  status: z.enum(["Draft", "Pending", "Approved", "Rejected"]),
  createdBy: z.string(),
  createdByName: z.string(),
  createdDate: z.string(),
  validUntil: z.string(),
  approvedBy: z.string().nullable(),
  approvedDate: z.string().nullable(),
  notes: z.string(),
});

export const insertQuotationSchema = quotationSchema.omit({ 
  id: true, 
  quotationNumber: true, 
  clientName: true, 
  subtotal: true,
  taxAmount: true,
  total: true,
  createdByName: true,
  approvedBy: true,
  approvedDate: true 
}).extend({
  approvedBy: z.string().nullable().optional(),
  approvedDate: z.string().nullable().optional(),
});

export type Quotation = z.infer<typeof quotationSchema>;
export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type QuotationItem = z.infer<typeof quotationItemSchema>;

// ==================== INVOICE SCHEMA ====================
export const invoiceSchema = z.object({
  id: z.number(),
  invoiceNumber: z.string(),
  quotationId: z.number(),
  clientId: z.number(),
  clientName: z.string(),
  clientAddress: z.string(),
  items: z.array(quotationItemSchema),
  subtotal: z.number(),
  taxAmount: z.number(),
  total: z.number(),
  status: z.enum(["Generated", "Sent", "Paid", "Overdue", "Partially Paid"]),
  generatedDate: z.string(),
  sentDate: z.string().nullable(),
  dueDate: z.string(),
  paidDate: z.string().nullable(),
  paidAmount: z.number(),
  paymentMethod: z.string().nullable(),
  transactionRef: z.string().nullable(),
  notes: z.string(),
});

export const insertInvoiceSchema = invoiceSchema.omit({ 
  id: true, 
  invoiceNumber: true,
  clientName: true,
  clientAddress: true,
  subtotal: true,
  taxAmount: true,
  total: true,
  sentDate: true,
  paidDate: true,
  paymentMethod: true,
  transactionRef: true
}).extend({
  sentDate: z.string().nullable().optional(),
  paidDate: z.string().nullable().optional(),
  paymentMethod: z.string().nullable().optional(),
  transactionRef: z.string().nullable().optional(),
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

// ==================== PAYMENT SCHEMA ====================
export const paymentSchema = z.object({
  paymentDate: z.string(),
  paymentAmount: z.number().min(0),
  paymentMethod: z.enum(["Cash", "Check", "Bank Transfer", "Credit Card", "UPI"]),
  transactionRef: z.string(),
  notes: z.string(),
});

export type Payment = z.infer<typeof paymentSchema>;

// ==================== TICKET SCHEMA ====================
export const ticketNoteSchema = z.object({
  text: z.string(),
  timestamp: z.string(),
  user: z.string(),
});

export const ticketSchema = z.object({
  id: z.number(),
  ticketNumber: z.string(),
  clientId: z.number(),
  clientName: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  status: z.enum(["Open", "In Progress", "Resolved", "Closed"]),
  assignedTo: z.string(),
  assignedToName: z.string(),
  createdDate: z.string(),
  createdBy: z.string(),
  notes: z.array(ticketNoteSchema),
  resolvedDate: z.string().nullable(),
  closedDate: z.string().nullable(),
});

export const insertTicketSchema = ticketSchema.omit({ 
  id: true, 
  ticketNumber: true, 
  clientName: true,
  assignedToName: true,
  notes: true,
  resolvedDate: true,
  closedDate: true
}).extend({
  notes: z.array(ticketNoteSchema).optional(),
  resolvedDate: z.string().nullable().optional(),
  closedDate: z.string().nullable().optional(),
});

export type Ticket = z.infer<typeof ticketSchema>;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type TicketNote = z.infer<typeof ticketNoteSchema>;

// ==================== ACTIVITY SCHEMA ====================
export const activitySchema = z.object({
  id: z.number(),
  timestamp: z.string(),
  user: z.string(),
  action: z.string(),
  entity: z.string(),
  entityId: z.number().nullable(),
});

export const insertActivitySchema = activitySchema.omit({ id: true });

export type Activity = z.infer<typeof activitySchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// ==================== DASHBOARD METRICS ====================
export const dashboardMetricsSchema = z.object({
  totalLeads: z.number(),
  totalClients: z.number(),
  totalQuotations: z.number(),
  totalRevenue: z.number(),
  pendingPayments: z.number(),
  leadStatusDistribution: z.object({
    New: z.number(),
    "In Progress": z.number(),
    Converted: z.number(),
    Lost: z.number(),
  }),
  quotationStatusDistribution: z.object({
    Draft: z.number(),
    Pending: z.number(),
    Approved: z.number(),
    Rejected: z.number(),
  }),
  monthlyRevenue: z.array(z.object({
    month: z.string(),
    revenue: z.number(),
  })),
});

export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>;
