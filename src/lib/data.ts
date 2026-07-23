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
const DEFAULT_CLIENTS: Client[] = [];
const DEFAULT_QUOTES: Quote[] = [];
const DEFAULT_INVOICES: Invoice[] = [];

const DEFAULT_SETTINGS: Settings = {
  company_name: "My Business",
  company_address: "",
  contact_name: "",
  phone: "",
  email: "",
  website: "",
  bank_name: "",
  account_name: "",
  account_number: "",
  branch_code: "",
  payshap_id: "",
  accent_color: "#051b38",
  currency: "R",
};

const DEFAULT_HISTORY: HistoryRecord[] = [];

// Storage key to ensure migration to clean state once
const CLEAN_SEED_KEY = "vylex_ops_empty_seeded_v1";

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
  if (typeof window !== "undefined") {
    localStorage.setItem(CLEAN_SEED_KEY, "true");
  }
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
  if (typeof window !== "undefined") {
    const isCleaned = localStorage.getItem(CLEAN_SEED_KEY) === "true";
    if (!isCleaned) {
      return resetToDefaults();
    }
  }

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
