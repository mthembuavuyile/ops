// ================= SHARED TYPE DEFINITIONS =================
// Single source of truth for all data structures in VylexOps

export interface Client {
  id: string;
  name: string;
  prefix: string;
  email: string;
  contact_name: string;
  phone: string;
  address: string;
}

export interface LineItem {
  description: string;
  qty: number;
  rate: number;
  details?: string[];
}

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";

export interface Quote {
  id: string;
  client_id: string;
  share_token?: string;
  quote_number: string;
  status: QuoteStatus;
  issued_at: string;
  expires_at: string;
  line_items: LineItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
}

export type InvoiceStatus = "unpaid" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  client_id: string;
  quote_id: string | null;
  invoice_number: string;
  status: InvoiceStatus;
  issued_at: string;
  due_at: string;
  line_items: LineItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
  paid_at?: string | null;
}

export interface Settings {
  company_name: string;
  company_address: string;
  contact_name: string;
  phone: string;
  email: string;
  website: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  branch_code: string;
  payshap_id: string;
  accent_color: string;
  currency: string;
}

export type ReminderTone = "gentle" | "due" | "overdue";

export interface DebtorReminder {
  name: string;
  phone: string;
  amount: string;
  invNo: string;
  dueDate: string;
  tone: ReminderTone;
}

export interface HistoryRecord {
  id: string;
  docNumber: string;
  clientName: string;
  clientPhone: string;
  total: string;
  date: string;
  dueDate: string;
  status: "Paid" | "Credit" | "Quote";
}

// App view identifiers for navigation
export type AppView =
  | "dashboard"
  | "billing"
  | "clients"
  | "builder"
  | "invoice-maker"
  | "reminders"
  | "history"
  | "settings"
  | "client-portal";

// Session for simple localStorage login
export interface UserSession {
  name: string;
  email: string;
  loggedInAt: string;
}
