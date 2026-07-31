// ================= DATA SERVICE LAYER =================
// Supabase Cloud — Single Source of Truth
// LocalStorage is a read-only cache for fast initial renders

import type { Client, Quote, Invoice, Settings, HistoryRecord, UserSession } from "./types";
import { supabase } from "./supabase";

// Storage keys for local caching
const KEYS = {
  clients: "vylex_ops_clients",
  quotes: "vylex_ops_quotes",
  invoices: "vylex_ops_invoices",
  settings: "vylex_ops_settings",
  history: "vylex_ops_history",
  session: "vylex_ops_session",
  migrated: "vylex_ops_migrated", // flag to track one-time guest→cloud migration
};

// ================= SEED DATA =================
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
  show_verified_badge: true,
};

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

// ================= LOCAL CACHE READERS (for fast initial render) =================
export function getCachedClients(): Client[] {
  return safeGet<Client[]>(KEYS.clients) || [];
}

export function getCachedQuotes(): Quote[] {
  return safeGet<Quote[]>(KEYS.quotes) || [];
}

export function getCachedInvoices(): Invoice[] {
  return safeGet<Invoice[]>(KEYS.invoices) || [];
}

export function getCachedSettings(): Settings {
  return safeGet<Settings>(KEYS.settings) || { ...DEFAULT_SETTINGS };
}

export function getCachedHistory(): HistoryRecord[] {
  return safeGet<HistoryRecord[]>(KEYS.history) || [];
}

// ================= DATA MUTATORS (Supabase first, then cache) =================
export async function saveClients(clients: Client[], userId: string): Promise<void> {
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
    if (error) {
      console.error("Error saving clients to Supabase:", error);
      return; // Don't update cache on failure
    }
  }
  safeSet(KEYS.clients, clients);
}

export async function deleteClientFromDb(id: string, userId: string): Promise<void> {
  const { error } = await supabase.from("clients").delete().eq("id", id).eq("user_id", userId);
  if (error) {
    console.error("Error deleting client from Supabase:", error);
    return;
  }
  // Update local cache after successful delete
  const current = getCachedClients();
  safeSet(KEYS.clients, current.filter(c => c.id !== id));
}

export async function saveQuotes(quotes: Quote[], userId: string): Promise<void> {
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
    if (error) {
      console.error("Error saving quotes to Supabase:", error);
      return;
    }
  }
  safeSet(KEYS.quotes, quotes);
}

export async function deleteQuoteFromDb(id: string, userId: string): Promise<void> {
  const { error } = await supabase.from("quotes").delete().eq("id", id).eq("user_id", userId);
  if (error) {
    console.error("Error deleting quote from Supabase:", error);
    return;
  }
  const current = getCachedQuotes();
  safeSet(KEYS.quotes, current.filter(q => q.id !== id));
}

export async function saveInvoices(invoices: Invoice[], userId: string): Promise<void> {
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
    if (error) {
      console.error("Error saving invoices to Supabase:", error);
      return;
    }
  }
  safeSet(KEYS.invoices, invoices);
}

export async function deleteInvoiceFromDb(id: string, userId: string): Promise<void> {
  const { error } = await supabase.from("invoices").delete().eq("id", id).eq("user_id", userId);
  if (error) {
    console.error("Error deleting invoice from Supabase:", error);
    return;
  }
  const current = getCachedInvoices();
  safeSet(KEYS.invoices, current.filter(i => i.id !== id));
}

export async function saveSettings(settings: Settings, userId: string): Promise<void> {
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
    show_verified_badge: settings.show_verified_badge ?? true,
  }, { onConflict: 'user_id' });
  if (error) {
    console.error("Error saving settings to Supabase:", error);
    return;
  }
  safeSet(KEYS.settings, settings);
}

export async function saveHistory(history: HistoryRecord[], userId: string): Promise<void> {
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
    if (error) {
      console.error("Error saving history to Supabase:", error);
      return;
    }
  }
  safeSet(KEYS.history, history);
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
    clients: [] as Client[],
    quotes: [] as Quote[],
    invoices: [] as Invoice[],
    settings: { ...DEFAULT_SETTINGS },
    history: [] as HistoryRecord[],
  };
  safeSet(KEYS.clients, data.clients);
  safeSet(KEYS.quotes, data.quotes);
  safeSet(KEYS.invoices, data.invoices);
  safeSet(KEYS.settings, data.settings);
  safeSet(KEYS.history, data.history);
  return data;
}

/**
 * Initialise data: always fetch from Supabase (the source of truth).
 * On first login, migrates any existing localStorage guest data to the cloud.
 */
export async function initData(userId: string): Promise<{
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  settings: Settings;
  history: HistoryRecord[];
}> {
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

    // One-time guest → cloud migration: if the user has never migrated and
    // the database is empty but localStorage has data, upload it
    const alreadyMigrated = safeGet<boolean>(KEYS.migrated);
    if (!alreadyMigrated) {
      const localClients = safeGet<Client[]>(KEYS.clients) || [];
      if (finalClients.length === 0 && localClients.length > 0) {
        await saveClients(localClients, userId);
        finalClients = localClients;
      }

      const localQuotes = safeGet<Quote[]>(KEYS.quotes) || [];
      if (finalQuotes.length === 0 && localQuotes.length > 0) {
        await saveQuotes(localQuotes, userId);
        finalQuotes = localQuotes;
      }

      const localInvoices = safeGet<Invoice[]>(KEYS.invoices) || [];
      if (finalInvoices.length === 0 && localInvoices.length > 0) {
        await saveInvoices(localInvoices, userId);
        finalInvoices = localInvoices;
      }

      if (!finalSettings) {
        const localSettings = safeGet<Settings>(KEYS.settings);
        if (localSettings) {
          finalSettings = localSettings;
          await saveSettings(finalSettings, userId);
        }
      }

      const localHistory = safeGet<HistoryRecord[]>(KEYS.history) || [];
      if (finalHistory.length === 0 && localHistory.length > 0) {
        await saveHistory(localHistory, userId);
        finalHistory = localHistory;
      }

      // Mark migration as done so it doesn't repeat
      safeSet(KEYS.migrated, true);
    }

    if (!finalSettings) {
      finalSettings = { ...DEFAULT_SETTINGS };
      await saveSettings(finalSettings, userId);
    }

    const freshData = {
      clients: finalClients,
      quotes: finalQuotes,
      invoices: finalInvoices,
      settings: finalSettings,
      history: finalHistory,
    };

    // Update local cache for fast subsequent renders
    safeSet(KEYS.clients, freshData.clients);
    safeSet(KEYS.quotes, freshData.quotes);
    safeSet(KEYS.invoices, freshData.invoices);
    safeSet(KEYS.settings, freshData.settings);
    safeSet(KEYS.history, freshData.history);

    return freshData;
  } catch (err) {
    console.error("Error initialising data from Supabase:", err);
    // Fallback to cache on network error (offline resilience)
    return {
      clients: getCachedClients(),
      quotes: getCachedQuotes(),
      invoices: getCachedInvoices(),
      settings: getCachedSettings(),
      history: getCachedHistory(),
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
    clients: getCachedClients(),
    quotes: getCachedQuotes(),
    invoices: getCachedInvoices(),
    settings: getCachedSettings(),
    history: getCachedHistory(),
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
  const clients = Array.isArray(parsed.clients) ? parsed.clients : getCachedClients();
  const quotes = Array.isArray(parsed.quotes) ? parsed.quotes : getCachedQuotes();
  const invoices = Array.isArray(parsed.invoices) ? parsed.invoices : getCachedInvoices();
  const settings = parsed.settings && typeof parsed.settings === "object" ? { ...getCachedSettings(), ...parsed.settings } : getCachedSettings();
  const history = Array.isArray(parsed.history) ? parsed.history : getCachedHistory();
  
  // Update local cache — the caller is responsible for syncing to Supabase
  safeSet(KEYS.clients, clients);
  safeSet(KEYS.quotes, quotes);
  safeSet(KEYS.invoices, invoices);
  safeSet(KEYS.settings, settings);
  safeSet(KEYS.history, history);

  return { clients, quotes, invoices, settings, history };
}
