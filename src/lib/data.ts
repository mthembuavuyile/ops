// ================= DATA SERVICE LAYER =================
// Supabase Cloud Sync Integration

import type { Client, Quote, Invoice, Settings, HistoryRecord, UserSession } from "./types";
import { supabase } from "./supabase";

// Storage keys for local caching (optimistic UI)
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

// ================= DATA ACCESSORS (LOCAL CACHE) =================
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

// ================= DATA MUTATORS (SYNC TO SUPABASE) =================
export async function saveClients(clients: Client[], userId?: string): Promise<void> {
  safeSet(KEYS.clients, clients);
  if (!userId) return;
  
  const payload = clients.map(c => ({ ...c, user_id: userId }));
  if (payload.length > 0) {
    await supabase.from("clients").upsert(payload, { onConflict: 'id' });
  }
}

export async function saveQuotes(quotes: Quote[], userId?: string): Promise<void> {
  safeSet(KEYS.quotes, quotes);
  if (!userId) return;

  const payload = quotes.map(q => ({ ...q, user_id: userId }));
  if (payload.length > 0) {
    await supabase.from("quotes").upsert(payload, { onConflict: 'id' });
  }
}

export async function saveInvoices(invoices: Invoice[], userId?: string): Promise<void> {
  safeSet(KEYS.invoices, invoices);
  if (!userId) return;

  const payload = invoices.map(i => ({ ...i, user_id: userId }));
  if (payload.length > 0) {
    await supabase.from("invoices").upsert(payload, { onConflict: 'id' });
  }
}

export async function saveSettings(settings: Settings, userId?: string): Promise<void> {
  safeSet(KEYS.settings, settings);
  if (!userId) return;

  await supabase.from("settings").upsert({ ...settings, user_id: userId }, { onConflict: 'user_id' });
}

export async function saveHistory(history: HistoryRecord[], userId?: string): Promise<void> {
  safeSet(KEYS.history, history);
  if (!userId) return;

  const payload = history.map(h => ({ ...h, user_id: userId }));
  if (payload.length > 0) {
    await supabase.from("history").upsert(payload, { onConflict: 'id' });
  }
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
  safeSet(KEYS.clients, data.clients);
  safeSet(KEYS.quotes, data.quotes);
  safeSet(KEYS.invoices, data.invoices);
  safeSet(KEYS.settings, data.settings);
  safeSet(KEYS.history, data.history);
  return data;
}

/**
 * Initialise data: load from Supabase if logged in, otherwise local cache.
 */
export async function initData(userId?: string): Promise<{
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  settings: Settings;
  history: HistoryRecord[];
}> {
  if (!userId) {
    // Guest mode: load from local storage
    return {
      clients: getClients(),
      quotes: getQuotes(),
      invoices: getInvoices(),
      settings: getSettings(),
      history: getHistory(),
    };
  }

  // Logged in: fetch from Supabase
  const [
    { data: clients },
    { data: quotes },
    { data: invoices },
    { data: settings },
    { data: history },
  ] = await Promise.all([
    supabase.from("clients").select("*"),
    supabase.from("quotes").select("*"),
    supabase.from("invoices").select("*"),
    supabase.from("settings").select("*").single(),
    supabase.from("history").select("*"),
  ]);

  const freshData = {
    clients: clients || [],
    quotes: quotes || [],
    invoices: invoices || [],
    settings: settings || DEFAULT_SETTINGS,
    history: history || [],
  };

  // Update local cache
  safeSet(KEYS.clients, freshData.clients);
  safeSet(KEYS.quotes, freshData.quotes);
  safeSet(KEYS.invoices, freshData.invoices);
  safeSet(KEYS.settings, freshData.settings);
  safeSet(KEYS.history, freshData.history);

  return freshData;
}

// ================= SESSION (Local Cache) =================
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

// ================= BACKUP & EXPORT =================
export function exportDataJSON(): string {
  const backup = {
    version: "2.0",
    exportedAt: new Date().toISOString(),
    clients: getClients(),
    quotes: getQuotes(),
    invoices: getInvoices(),
    settings: getSettings(),
    history: getHistory(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importDataJSON(jsonStr: string): {
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  settings: Settings;
  history: HistoryRecord[];
} {
  const parsed = JSON.parse(jsonStr);
  const clients = Array.isArray(parsed.clients) ? parsed.clients : getClients();
  const quotes = Array.isArray(parsed.quotes) ? parsed.quotes : getQuotes();
  const invoices = Array.isArray(parsed.invoices) ? parsed.invoices : getInvoices();
  const settings = parsed.settings && typeof parsed.settings === "object" ? { ...getSettings(), ...parsed.settings } : getSettings();
  const history = Array.isArray(parsed.history) ? parsed.history : getHistory();
  
  // Note: For a logged in user, they should trigger a sync after import, handled in useAppData
  safeSet(KEYS.clients, clients);
  safeSet(KEYS.quotes, quotes);
  safeSet(KEYS.invoices, invoices);
  safeSet(KEYS.settings, settings);
  safeSet(KEYS.history, history);

  return { clients, quotes, invoices, settings, history };
}

