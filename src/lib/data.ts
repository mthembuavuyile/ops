// ================= DATA SERVICE LAYER =================
// 100% localStorage — no backend needed

import type { Client, Quote, Invoice, Settings, HistoryRecord, UserSession } from "./types";

// Storage keys
const KEYS = {
  clients: "vylex_ops_clients",
  quotes: "vylex_ops_quotes",
  invoices: "vylex_ops_invoices",
  settings: "vylex_ops_settings",
  history: "vylex_ops_history",
  session: "vylex_ops_session",
};

// ================= SEED DATA =================
const DEFAULT_CLIENTS: Client[] = [
  {
    id: "c-1",
    name: "Makhaswa Holdings",
    prefix: "MH",
    email: "lucas@makhaswa.co.za",
    contact_name: "Lucas (Owner)",
    phone: "+27 64 878 4287",
    address: "12 Marine Drive, Durban, 4001",
  },
  {
    id: "c-2",
    name: "Luxury Shutters & Blinds",
    prefix: "LSB",
    email: "info@luxuryshuttersandblinds.co.za",
    contact_name: "Sicelo Meyiwa (Owner)",
    phone: "+27 71 926 8316",
    address: "42 Bank Terrace, Westridge, Durban, 4091",
  },
  {
    id: "c-3",
    name: "Tokyo Creative Studio",
    prefix: "TC",
    email: "hello@tokyocreative.co.za",
    contact_name: "Kenji Tokyo (Director)",
    phone: "+27 83 222 1111",
    address: "44 Sandton Drive, Sandton, Johannesburg, 2196",
  },
];

const DEFAULT_QUOTES: Quote[] = [
  {
    id: "q-1",
    client_id: "c-3",
    quote_number: "Q-2026-001",
    status: "draft",
    issued_at: "2026-07-10",
    expires_at: "2026-07-24",
    line_items: [
      {
        description: "Homepage UI/UX Redesign - Tokyo Creative Portal",
        qty: 1,
        rate: 9500.0,
        details: [
          "Modernised interface using Inter typography & custom grid layouts",
          "Centralised, dynamic banner management",
          "Dynamic filter engine for creative portfolio projects",
          "SEO preserved via metadata & clean semantic HTML",
        ],
      },
    ],
    subtotal: 9500.0,
    vat: 0,
    total: 9500.0,
    notes: "Requires assets to be delivered by client team.",
  },
  {
    id: "q-2",
    client_id: "c-2",
    quote_number: "Q-2026-002",
    status: "accepted",
    issued_at: "2026-07-11",
    expires_at: "2026-07-25",
    line_items: [
      {
        description: "Website V2 Redesign & Code Architecture Refactoring",
        qty: 1,
        rate: 800.0,
        details: [
          "Modernised site using Montserrat typography and custom grid layouts",
          "Centralised, dynamic header/footer component loading",
          "Dynamic product engine with category filtering and image lightbox",
          "SEO preserved via canonical URLs, schema markup, and custom metadata",
        ],
      },
    ],
    subtotal: 800.0,
    vat: 0,
    total: 800.0,
    notes: "Enhancements for print-ready invoice layouts.",
  },
  {
    id: "q-3",
    client_id: "c-1",
    quote_number: "Q-2026-003",
    status: "sent",
    issued_at: "2026-07-15",
    expires_at: "2026-07-29",
    line_items: [
      {
        description: "Update gallery page & optimize construction project images",
        qty: 1,
        rate: 1500.0,
        details: [
          "Optimized 50+ high-res portfolio images for fast web delivery",
          "Integrated smooth lightbox viewer gallery component",
        ],
      },
      {
        description: "Develop custom operational team portal login",
        qty: 1,
        rate: 12000.0,
        details: [
          "Secure single-tenant auth gate with role-based access",
          "Connected database schemas for real-time client records",
        ],
      },
    ],
    subtotal: 13500.0,
    vat: 0,
    total: 13500.0,
    notes: "Direct integration with client's live staging portal.",
  },
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    client_id: "c-2",
    quote_id: "q-2",
    invoice_number: "LSB-2026-001",
    status: "paid",
    issued_at: "2026-07-11",
    due_at: "2026-07-18",
    line_items: [
      {
        description: "Website V2 Redesign & Code Architecture Refactoring",
        qty: 1,
        rate: 800.0,
        details: [
          "Modernised site using Montserrat typography and custom grid layouts",
          "Centralised, dynamic header/footer component loading",
          "Dynamic product engine with category filtering and image lightbox",
          "SEO preserved via canonical URLs, schema markup, and custom metadata",
        ],
      },
    ],
    subtotal: 800.0,
    vat: 0,
    total: 800.0,
    notes: "Settled via EFT on 2026-07-12.",
    paid_at: "2026-07-12",
  },
  {
    id: "inv-2",
    client_id: "c-1",
    quote_id: null,
    invoice_number: "MH-2026-001",
    status: "unpaid",
    issued_at: "2026-07-01",
    due_at: "2026-07-15",
    line_items: [
      {
        description: "Emergency server repair & DNS routing recovery",
        qty: 1,
        rate: 8500.0,
        details: [
          "Investigated core VM failure on cloud hosting platform",
          "Restored standard database backups and verified schema integrity",
          "Reconfigured Cloudflare proxy routing for fast SSL recovery",
        ],
      },
    ],
    subtotal: 8500.0,
    vat: 0,
    total: 8500.0,
    notes: "Overdue support intervention.",
    paid_at: null,
  },
];

const DEFAULT_SETTINGS: Settings = {
  company_name: "Vylex",
  company_address: "Durban, South Africa",
  contact_name: "Avuyile Mthembu",
  phone: "+27 64 878 4287",
  email: "info@vylex.co.za",
  website: "vylex.co.za",
  bank_name: "Standard Bank",
  account_name: "Vylex",
  account_number: "1017 126 3314",
  branch_code: "7654",
  payshap_id: "064 878 4287",
  accent_color: "#051b38",
  currency: "R",
};

const DEFAULT_HISTORY: HistoryRecord[] = [
  {
    id: "h-1",
    docNumber: "INV-1082",
    clientName: "Makhaswa Holdings",
    clientPhone: "+27 64 878 4287",
    total: "1285.25",
    date: "2026-07-15",
    dueDate: "2026-07-22",
    status: "Credit",
  },
  {
    id: "h-2",
    docNumber: "INV-1079",
    clientName: "Sipho Traders",
    clientPhone: "+27 83 555 1234",
    total: "450.00",
    date: "2026-07-10",
    dueDate: "2026-07-17",
    status: "Paid",
  },
];

// ================= SAFE LOCALSTORAGE HELPERS =================
function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ================= DATA ACCESSORS =================
export function getClients(): Client[] {
  return safeGet<Client[]>(KEYS.clients) || [...DEFAULT_CLIENTS];
}

export function getQuotes(): Quote[] {
  return safeGet<Quote[]>(KEYS.quotes) || [...DEFAULT_QUOTES];
}

export function getInvoices(): Invoice[] {
  return safeGet<Invoice[]>(KEYS.invoices) || [...DEFAULT_INVOICES];
}

export function getSettings(): Settings {
  return safeGet<Settings>(KEYS.settings) || { ...DEFAULT_SETTINGS };
}

export function getHistory(): HistoryRecord[] {
  return safeGet<HistoryRecord[]>(KEYS.history) || [...DEFAULT_HISTORY];
}

// ================= DATA MUTATORS =================
export function saveClients(clients: Client[]): void {
  safeSet(KEYS.clients, clients);
}

export function saveQuotes(quotes: Quote[]): void {
  safeSet(KEYS.quotes, quotes);
}

export function saveInvoices(invoices: Invoice[]): void {
  safeSet(KEYS.invoices, invoices);
}

export function saveSettings(settings: Settings): void {
  safeSet(KEYS.settings, settings);
}

export function saveHistory(history: HistoryRecord[]): void {
  safeSet(KEYS.history, history);
}

export function saveAll(
  clients: Client[],
  quotes: Quote[],
  invoices: Invoice[],
  settings: Settings,
  history: HistoryRecord[]
): void {
  saveClients(clients);
  saveQuotes(quotes);
  saveInvoices(invoices);
  saveSettings(settings);
  saveHistory(history);
}

// ================= RESET / SEED =================
export function resetToDefaults(): {
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  settings: Settings;
  history: HistoryRecord[];
} {
  const data = {
    clients: [...DEFAULT_CLIENTS],
    quotes: [...DEFAULT_QUOTES],
    invoices: [...DEFAULT_INVOICES],
    settings: { ...DEFAULT_SETTINGS },
    history: [...DEFAULT_HISTORY],
  };
  saveAll(data.clients, data.quotes, data.invoices, data.settings, data.history);
  return data;
}

/**
 * Initialise data: load from localStorage or seed defaults.
 */
export function initData(): {
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  settings: Settings;
  history: HistoryRecord[];
} {
  const hasData = typeof window !== "undefined" && localStorage.getItem(KEYS.clients) !== null;

  if (!hasData) {
    return resetToDefaults();
  }

  return {
    clients: getClients(),
    quotes: getQuotes(),
    invoices: getInvoices(),
    settings: getSettings(),
    history: getHistory(),
  };
}

// ================= SESSION (Simple localStorage login) =================
export function getSession(): UserSession | null {
  return safeGet<UserSession>(KEYS.session);
}

export function setSession(session: UserSession): void {
  safeSet(KEYS.session, session);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.session);
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}
