"use client";

import { useState, useEffect, useCallback } from "react";
import type { Client, Quote, Invoice, Settings, HistoryRecord, AppView, DebtorReminder, UserSession } from "@/lib/types";
import * as db from "@/lib/data";

export interface AppData {
  // Data
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  settings: Settings;
  history: HistoryRecord[];

  // Session
  session: UserSession | null;
  logout: () => void;

  // Navigation
  activeView: AppView;
  setActiveView: (view: AppView) => void;

  // Client portal state
  activePortalQuoteId: string;
  setActivePortalQuoteId: (id: string) => void;

  // Debtor reminder state
  reminder: DebtorReminder;
  setReminder: (r: DebtorReminder) => void;

  // Data mutations & backup
  updateClients: (clients: Client[]) => void;
  deleteClient: (id: string) => void;
  updateQuotes: (quotes: Quote[]) => void;
  deleteQuote: (id: string) => void;
  updateInvoices: (invoices: Invoice[]) => void;
  deleteInvoice: (id: string) => void;
  updateSettings: (settings: Settings) => void;
  updateHistory: (history: HistoryRecord[]) => void;
  resetData: () => void;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => boolean;

  // Sync
  refreshCloudData: () => Promise<void>;

  // Ready state
  ready: boolean;
}

export function useAppData(): AppData {
  const [ready, setReady] = useState(false);
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<Settings>(db.getSettings());
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [activeView, setActiveView] = useState<AppView>("dashboard");
  const [activePortalQuoteId, setActivePortalQuoteId] = useState("");
  const [reminder, setReminder] = useState<DebtorReminder>({
    name: "",
    phone: "",
    amount: "",
    invNo: "",
    dueDate: "",
    tone: "gentle",
  });

  const refreshCloudData = useCallback(async () => {
    const currentSession = db.getSession();
    const userId = session?.id || currentSession?.id;
    if (!userId) return;
    const data = await db.initData(userId);
    setClients(data.clients);
    setQuotes(data.quotes);
    setInvoices(data.invoices);
    setSettings(data.settings);
    setHistory(data.history);
  }, [session?.id]);

  // Initialise data from localStorage/Supabase on mount
  useEffect(() => {
    let currentUserId: string | undefined = undefined;

    const loadData = async (userId?: string) => {
      const data = await db.initData(userId);
      setClients(data.clients);
      setQuotes(data.quotes);
      setInvoices(data.invoices);
      setSettings(data.settings);
      setHistory(data.history);
      setReady(true);
    };

    const hasSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";
    if (hasSupabaseKey) {
      import("@/lib/supabase").then(({ supabase }) => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session: supaSession } }) => {
          if (supaSession) {
             const userSession = {
                id: supaSession.user.id,
                name: supaSession.user.user_metadata?.company_name || supaSession.user.email?.split('@')[0] || "User",
                email: supaSession.user.email || "",
                loggedInAt: new Date().toISOString(),
             };
             currentUserId = userSession.id;
             setSessionState(userSession);
             db.setSession(userSession);
          } else {
             const localSession = db.getSession();
             if (localSession?.id) currentUserId = localSession.id;
             setSessionState(localSession);
          }
          loadData(currentUserId);
        });

        // Listen for auth changes (login, logout, token refresh)
        supabase.auth.onAuthStateChange((_event, supaSession) => {
          if (supaSession) {
             const userSession = {
                id: supaSession.user.id,
                name: supaSession.user.user_metadata?.company_name || supaSession.user.email?.split('@')[0] || "User",
                email: supaSession.user.email || "",
                loggedInAt: new Date().toISOString(),
             };
             setSessionState(userSession);
             db.setSession(userSession);
             loadData(userSession.id);
          } else {
             setSessionState(null);
             db.clearSession();
             loadData(undefined);
          }
        });
      });
    } else {
      requestAnimationFrame(() => {
        const localSession = db.getSession();
        setSessionState(localSession);
        loadData(localSession?.id);
      });
    }
  }, []);

  // Window focus & interval auto-sync for multi-device sync
  useEffect(() => {
    const activeUserId = session?.id;
    if (!activeUserId) return;

    const onFocus = () => {
      refreshCloudData();
    };

    window.addEventListener("focus", onFocus);
    const interval = setInterval(() => {
      refreshCloudData();
    }, 10000);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [session?.id, refreshCloudData]);

  const logout = useCallback(() => {
    db.clearSession();
    setSessionState(null);
    const hasSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";
    if (hasSupabaseKey) {
       import("@/lib/supabase").then(({ supabase }) => {
          supabase.auth.signOut();
       });
    }
  }, []);

  // Persistence wrappers
  const updateClients = useCallback((c: Client[]) => {
    setClients(c);
    db.saveClients(c, session?.id);
  }, [session]);

  const deleteClient = useCallback((id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    db.deleteClientFromDb(id, session?.id);
  }, [session]);

  const updateQuotes = useCallback((q: Quote[]) => {
    setQuotes(q);
    db.saveQuotes(q, session?.id);
  }, [session]);

  const deleteQuote = useCallback((id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    db.deleteQuoteFromDb(id, session?.id);
  }, [session]);

  const updateInvoices = useCallback((inv: Invoice[]) => {
    setInvoices(inv);
    db.saveInvoices(inv, session?.id);
  }, [session]);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
    db.deleteInvoiceFromDb(id, session?.id);
  }, [session]);

  const updateSettings = useCallback((s: Settings) => {
    setSettings(s);
    db.saveSettings(s, session?.id);
  }, [session]);

  const updateHistory = useCallback((h: HistoryRecord[]) => {
    setHistory(h);
    db.saveHistory(h, session?.id);
  }, [session]);

  const resetData = useCallback(() => {
    const data = db.resetToDefaults();
    setClients(data.clients);
    setQuotes(data.quotes);
    setInvoices(data.invoices);
    setSettings(data.settings);
    setHistory(data.history);
  }, []);

  const exportBackup = useCallback(() => {
    return db.exportDataJSON();
  }, []);

  const importBackup = useCallback((jsonStr: string) => {
    try {
      const data = db.importDataJSON(jsonStr);
      setClients(data.clients);
      setQuotes(data.quotes);
      setInvoices(data.invoices);
      setSettings(data.settings);
      setHistory(data.history);
      
      // Sync to cloud if logged in
      if (session?.id) {
        db.saveClients(data.clients, session.id);
        db.saveQuotes(data.quotes, session.id);
        db.saveInvoices(data.invoices, session.id);
        db.saveSettings(data.settings, session.id);
        db.saveHistory(data.history, session.id);
      }
      return true;
    } catch {
      return false;
    }
  }, [session]);

  return {
    clients,
    quotes,
    invoices,
    settings,
    history,
    session,
    logout,
    activeView,
    setActiveView,
    activePortalQuoteId,
    setActivePortalQuoteId,
    reminder,
    setReminder,
    updateClients,
    deleteClient,
    updateQuotes,
    deleteQuote,
    updateInvoices,
    deleteInvoice,
    updateSettings,
    updateHistory,
    resetData,
    exportBackup,
    importBackup,
    refreshCloudData,
    ready,
  };
}
