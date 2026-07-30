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
  updateQuotes: (quotes: Quote[]) => void;
  updateInvoices: (invoices: Invoice[]) => void;
  updateSettings: (settings: Settings) => void;
  updateHistory: (history: HistoryRecord[]) => void;
  resetData: () => void;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => boolean;

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

  // Initialise data from localStorage on mount
  useEffect(() => {
    const data = db.initData();
    setClients(data.clients);
    setQuotes(data.quotes);
    setInvoices(data.invoices);
    setSettings(data.settings);
    setHistory(data.history);
    setSessionState(db.getSession());
    setReady(true);
  }, []);

  const logout = useCallback(() => {
    db.clearSession();
    setSessionState(null);
  }, []);

  // Persistence wrappers
  const updateClients = useCallback((c: Client[]) => {
    setClients(c);
    db.saveClients(c);
  }, []);

  const updateQuotes = useCallback((q: Quote[]) => {
    setQuotes(q);
    db.saveQuotes(q);
  }, []);

  const updateInvoices = useCallback((inv: Invoice[]) => {
    setInvoices(inv);
    db.saveInvoices(inv);
  }, []);

  const updateSettings = useCallback((s: Settings) => {
    setSettings(s);
    db.saveSettings(s);
  }, []);

  const updateHistory = useCallback((h: HistoryRecord[]) => {
    setHistory(h);
    db.saveHistory(h);
  }, []);

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
      return true;
    } catch {
      return false;
    }
  }, []);

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
    updateQuotes,
    updateInvoices,
    updateSettings,
    updateHistory,
    resetData,
    exportBackup,
    importBackup,
    ready,
  };
}
