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
  
  const payload = clients.map(c => ({
    id: c.id,
    name: c.name,
    prefix: c.prefix,
    email: c.email || "",
    contact_name: c.contact_name || "",
    phone: c.phone || "",
    address: c.address || "",
    user_id: userId,
  }));
  if (payload.length > 0) {
    const { error } = await supabase.from("clients").upsert(payload, { onConflict: 'id' });
    if (error) console.error("Error saving clients to Supabase:", error);
  }
}

export async function deleteClientFromDb(id: string, userId?: string): Promise<void> {
  const current = getClients();
  const updated = current.filter(c => c.id !== id);
  safeSet(KEYS.clients, updated);
  if (!userId) return;

  const { error } = await supabase.from("clients").delete().eq("id", id).eq("user_id", userId);
  if (error) console.error("Error deleting client from Supabase:", error);
}

export async function saveQuotes(quotes: Quote[], userId?: string): Promise<void> {
  safeSet(KEYS.quotes, quotes);
  if (!userId) return;

  const payload = quotes.map(q => ({
    id: q.id,
    client_id: q.client_id,
    quote_number: q.quote_number,
    status: q.status,
    issued_at: q.issued_at,
    expires_at: q.expires_at,
    line_items: q.line_items,
    subtotal: q.subtotal,
    vat: q.vat,
    total: q.total,
    notes: q.notes || "",
    share_token: q.share_token || null,
    user_id: userId,
  }));
  if (payload.length > 0) {
    const { error } = await supabase.from("quotes").upsert(payload, { onConflict: 'id' });
    if (error) console.error("Error saving quotes to Supabase:", error);
  }
}

export async function deleteQuoteFromDb(id: string, userId?: string): Promise<void> {
  const current = getQuotes();
  const updated = current.filter(q => q.id !== id);
  safeSet(KEYS.quotes, updated);
  if (!userId) return;

  const { error } = await supabase.from("quotes").delete().eq("id", id).eq("user_id", userId);
  if (error) console.error("Error deleting quote from Supabase:", error);
}

export async function saveInvoices(invoices: Invoice[], userId?: string): Promise<void> {
  safeSet(KEYS.invoices, invoices);
  if (!userId) return;

  const payload = invoices.map(i => ({
    id: i.id,
    client_id: i.client_id,
    quote_id: i.quote_id || null,
    invoice_number: i.invoice_number,
    status: i.status,
    issued_at: i.issued_at,
    due_at: i.due_at,
    line_items: i.line_items,
    subtotal: i.subtotal,
    vat: i.vat,
    total: i.total,
    notes: i.notes || "",
    paid_at: i.paid_at || null,
    user_id: userId,
  }));
  if (payload.length > 0) {
    const { error } = await supabase.from("invoices").upsert(payload, { onConflict: 'id' });
    if (error) console.error("Error saving invoices to Supabase:", error);
  }
}

export async function deleteInvoiceFromDb(id: string, userId?: string): Promise<void> {
  const current = getInvoices();
  const updated = current.filter(i => i.id !== id);
  safeSet(KEYS.invoices, updated);
  if (!userId) return;

  const { error } = await supabase.from("invoices").delete().eq("id", id).eq("user_id", userId);
  if (error) console.error("Error deleting invoice from Supabase:", error);
}

export async function saveSettings(settings: Settings, userId?: string): Promise<void> {
  safeSet(KEYS.settings, settings);
  if (!userId) return;

  const { error } = await supabase.from("settings").upsert({
    user_id: userId,
    company_name: settings.company_name,
    company_address: settings.company_address || "",
    contact_name: settings.contact_name || "",
    phone: settings.phone || "",
    email: settings.email || "",
    website: settings.website || "",
    bank_name: settings.bank_name || "",
    account_name: settings.account_name || "",
    account_number: settings.account_number || "",
    branch_code: settings.branch_code || "",
    payshap_id: settings.payshap_id || "",
    accent_color: settings.accent_color || "#051b38",
    currency: settings.currency || "R",
  }, { onConflict: 'user_id' });
  if (error) console.error("Error saving settings to Supabase:", error);
}

export async function saveHistory(history: HistoryRecord[], userId?: string): Promise<void> {
  safeSet(KEYS.history, history);
  if (!userId) return;

  const payload = history.map(h => ({
    id: h.id,
    docNumber: h.docNumber,
    clientName: h.clientName || "",
    clientPhone: h.clientPhone || "",
    total: h.total,
    date: h.date,
    dueDate: h.dueDate,
    status: h.status,
    user_id: userId,
  }));
  if (payload.length > 0) {
    const { error } = await supabase.from("history").upsert(payload, { onConflict: 'id' });
    if (error) console.error("Error saving history to Supabase:", error);
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
  try {
    const [
      { data: clients, error: clientsErr },
      { data: quotes, error: quotesErr },
      { data: invoices, error: invoicesErr },
      { data: settings, error: settingsErr },
      { data: history, error: historyErr },
    ] = await Promise.all([
      supabase.from("clients").select("*").eq("user_id", userId),
      supabase.from("quotes").select("*").eq("user_id", userId),
      supabase.from("invoices").select("*").eq("user_id", userId),
      supabase.from("settings").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("history").select("*").eq("user_id", userId),
    ]);

    if (clientsErr) console.warn("Supabase clients fetch error:", clientsErr);
    if (quotesErr) console.warn("Supabase quotes fetch error:", quotesErr);
    if (invoicesErr) console.warn("Supabase invoices fetch error:", invoicesErr);
    if (settingsErr) console.warn("Supabase settings fetch error:", settingsErr);
    if (historyErr) console.warn("Supabase history fetch error:", historyErr);

    let finalClients = clients || [];
    let finalQuotes = quotes || [];
    let finalInvoices = invoices || [];
    let finalSettings = settings || null;
    let finalHistory = history || [];

    // Guest -> DB auto migration: if database has 0 clients/quotes/invoices but local storage has data, upload local data to Supabase for the user
    const localClients = getClients();
    if (finalClients.length === 0 && localClients.length > 0) {
      await saveClients(localClients, userId);
      finalClients = localClients;
    }

    const localQuotes = getQuotes();
    if (finalQuotes.length === 0 && localQuotes.length > 0) {
      await saveQuotes(localQuotes, userId);
      finalQuotes = localQuotes;
    }

    const localInvoices = getInvoices();
    if (finalInvoices.length === 0 && localInvoices.length > 0) {
      await saveInvoices(localInvoices, userId);
      finalInvoices = localInvoices;
    }

    if (!finalSettings) {
      const localSettings = getSettings();
      finalSettings = localSettings || DEFAULT_SETTINGS;
      await saveSettings(finalSettings, userId);
    }

    const localHistory = getHistory();
    if (finalHistory.length === 0 && localHistory.length > 0) {
      await saveHistory(localHistory, userId);
      finalHistory = localHistory;
    }

    const freshData = {
      clients: finalClients,
      quotes: finalQuotes,
      invoices: finalInvoices,
      settings: finalSettings,
      history: finalHistory,
    };

    // Update local cache
    safeSet(KEYS.clients, freshData.clients);
    safeSet(KEYS.quotes, freshData.quotes);
    safeSet(KEYS.invoices, freshData.invoices);
    safeSet(KEYS.settings, freshData.settings);
    safeSet(KEYS.history, freshData.history);

    return freshData;
  } catch (err) {
    console.error("Error initialising data from Supabase:", err);
    return {
      clients: getClients(),
      quotes: getQuotes(),
      invoices: getInvoices(),
      settings: getSettings(),
      history: getHistory(),
    };
  }
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

