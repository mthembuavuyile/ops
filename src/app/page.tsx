"use client";

import React, { useState, useCallback } from "react";
import { useAppData } from "@/hooks/useAppData";
import { useToast } from "@/hooks/useToast";
import type { Quote, Invoice, HistoryRecord } from "@/lib/types";
import { todayISO, futureDateISO } from "@/lib/formatters";
import { buildWhatsAppUrl, generateShareMessage } from "@/lib/whatsapp";

// Layout
import Sidebar from "@/components/layout/Sidebar";
import ToastBanner from "@/components/layout/ToastBanner";

// Views
import StatCards from "@/components/dashboard/StatCards";
import UnpaidInvoicesTable from "@/components/dashboard/UnpaidInvoicesTable";
import ClientList from "@/components/dashboard/ClientList";
import ClientManager from "@/components/clients/ClientManager";
import QuotesTable from "@/components/billing/QuotesTable";
import InvoicesTable from "@/components/billing/InvoicesTable";
import QuoteBuilderForm from "@/components/builder/QuoteBuilderForm";
import InvoiceMakerForm from "@/components/invoice-maker/InvoiceMakerForm";
import PaymentReminderForm from "@/components/reminders/PaymentReminderForm";
import HistoryTable from "@/components/history/HistoryTable";
import SettingsForm from "@/components/settings/SettingsForm";
import ClientPortal from "@/components/portal/ClientPortal";

export default function OpsApp() {
  const app = useAppData();
  const { toasts, showToast, dismissToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ================= ACTION HANDLERS =================

  const handleSaveClient = useCallback((client: import("@/lib/types").Client) => {
    const isExisting = app.clients.find(c => c.id === client.id);
    const updated = isExisting 
      ? app.clients.map(c => c.id === client.id ? client : c)
      : [...app.clients, client];
    app.updateClients(updated);
    showToast(isExisting ? "✏️ Client updated successfully" : "👤 New client added!", "success");
  }, [app, showToast]);

  const handleDeleteClient = useCallback((id: string) => {
    const updated = app.clients.filter(c => c.id !== id);
    app.updateClients(updated);
    showToast("🗑️ Client deleted", "warning");
  }, [app, showToast]);

  const markInvoicePaid = useCallback(
    (id: string) => {
      const updated = app.invoices.map((inv) =>
        inv.id === id ? { ...inv, status: "paid" as const, paid_at: todayISO() } : inv
      );
      app.updateInvoices(updated);
      const inv = updated.find((i) => i.id === id);
      showToast(`💰 Invoice ${inv?.invoice_number} marked as PAID!`, "success");
    },
    [app, showToast]
  );

  const handleQuoteSubmit = useCallback(
    (quote: Quote) => {
      const updated = [...app.quotes, quote];
      app.updateQuotes(updated);
      showToast(`🚀 Quote ${quote.quote_number} generated and sent!`, "success");
      app.setActivePortalQuoteId(quote.id);
      app.setActiveView("client-portal");
    },
    [app, showToast]
  );

  const handleAcceptQuote = useCallback(
    (quoteId: string) => {
      const quote = app.quotes.find((q) => q.id === quoteId);
      if (!quote || quote.status === "accepted") {
        showToast("⚠️ This quote has already been accepted.", "warning");
        return;
      }

      // Update quote status
      const updatedQuotes = app.quotes.map((q) =>
        q.id === quoteId ? { ...q, status: "accepted" as const } : q
      );
      app.updateQuotes(updatedQuotes);

      // Create invoice from quote
      const client = app.clients.find((c) => c.id === quote.client_id);
      const clientInvoices = app.invoices.filter((i) => i.client_id === quote.client_id);
      const prefix = client?.prefix || "INV";
      const invoiceNum = `${prefix}-2026-${String(clientInvoices.length + 1).padStart(3, "0")}`;

      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        client_id: quote.client_id,
        quote_id: quote.id,
        invoice_number: invoiceNum,
        status: "unpaid",
        issued_at: todayISO(),
        due_at: futureDateISO(14),
        line_items: quote.line_items,
        subtotal: quote.total,
        vat: 0,
        total: quote.total,
        notes: quote.notes,
        paid_at: null,
      };

      app.updateInvoices([...app.invoices, newInvoice]);
      showToast(`🎉 Quote accepted! Invoice ${invoiceNum} generated.`, "success");
    },
    [app, showToast]
  );

  const handleDeclineQuote = useCallback(
    (quoteId: string) => {
      const updatedQuotes = app.quotes.map((q) =>
        q.id === quoteId ? { ...q, status: "declined" as const } : q
      );
      app.updateQuotes(updatedQuotes);
      showToast("❌ Quote declined.", "warning");
    },
    [app, showToast]
  );

  const handleShareWhatsApp = useCallback(
    (type: "quote" | "invoice", id: string) => {
      let docNum = "";
      let clientName = "";
      let total = 0;
      let phone = "";

      if (type === "quote") {
        const q = app.quotes.find((q) => q.id === id);
        const c = q ? app.clients.find((c) => c.id === q.client_id) : null;
        if (!q || !c) return;
        docNum = q.quote_number;
        clientName = c.contact_name || c.name;
        total = q.total;
        phone = c.phone;
      } else {
        const inv = app.invoices.find((i) => i.id === id);
        const c = inv ? app.clients.find((c) => c.id === inv.client_id) : null;
        if (!inv || !c) return;
        docNum = inv.invoice_number;
        clientName = c.contact_name || c.name;
        total = inv.total;
        phone = c.phone;
      }

      const msg = generateShareMessage(type, docNum, clientName, total, app.settings);
      const url = buildWhatsAppUrl(phone, msg);
      window.open(url, "_blank");
      showToast(`💬 WhatsApp link opened for ${docNum}!`, "success");
    },
    [app, showToast]
  );

  const handleOpenPortal = useCallback(
    (quoteId: string) => {
      app.setActivePortalQuoteId(quoteId);
      app.setActiveView("client-portal");
    },
    [app]
  );

  const handleToggleHistoryStatus = useCallback(
    (id: string) => {
      const updated = app.history.map((h) =>
        h.id === id ? { ...h, status: (h.status === "Paid" ? "Credit" : "Paid") as HistoryRecord["status"] } : h
      );
      app.updateHistory(updated);
    },
    [app]
  );

  const handleSendReminderFromHistory = useCallback(
    (record: HistoryRecord) => {
      app.setReminder({
        name: record.clientName,
        phone: record.clientPhone,
        amount: record.total,
        invNo: record.docNumber,
        dueDate: record.dueDate,
        tone: "gentle",
      });
      app.setActiveView("reminders");
      showToast("📝 Reminder pre-filled from history.", "info");
    },
    [app, showToast]
  );

  const handleSaveSettings = useCallback(
    (s: typeof app.settings) => {
      app.updateSettings(s);
      showToast("⚙️ Settings saved successfully!", "success");
      app.setActiveView("dashboard");
    },
    [app, showToast]
  );

  const handleReset = useCallback(() => {
    app.resetData();
    showToast("🔄 All data reset to defaults.", "warning");
  }, [app, showToast]);

  // Loading state
  if (!app.ready) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <i className="fa-solid fa-spinner animate-spin text-3xl text-brand-accent" />
          <p className="text-sm text-slate-500 font-medium">Loading VylexOps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Toast Notifications */}
      <ToastBanner toasts={toasts} onDismiss={dismissToast} />

      {/* Sidebar */}
      <Sidebar
        activeView={app.activeView}
        onNavigate={(view) => {
          app.setActiveView(view);
          // If navigating to client portal without a selected quote, pick the last one
          if (view === "client-portal" && !app.activePortalQuoteId && app.quotes.length > 0) {
            app.setActivePortalQuoteId(app.quotes[app.quotes.length - 1].id);
          }
        }}
        onReset={handleReset}
        companyName={app.settings.company_name}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600 p-1">
            <i className="fa-solid fa-bars text-lg" />
          </button>
          <span className="font-extrabold text-slate-900 tracking-tight">
            {(app.settings.company_name || "VYLEX").toUpperCase()}
            <span className="text-brand-accent">OPS</span>
          </span>
          <div className="w-8" />
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* DASHBOARD */}
          {app.activeView === "dashboard" && (
            <div className="space-y-6">
              <StatCards
                invoices={app.invoices}
                quotes={app.quotes}
                currency={app.settings.currency}
                onNewQuote={() => app.setActiveView("builder")}
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <UnpaidInvoicesTable
                    invoices={app.invoices}
                    clients={app.clients}
                    currency={app.settings.currency}
                    onMarkPaid={markInvoicePaid}
                  />
                </div>
                <ClientList clients={app.clients} />
              </div>
            </div>
          )}

          {/* CLIENTS */}
          {app.activeView === "clients" && (
            <ClientManager
              clients={app.clients}
              onSaveClient={handleSaveClient}
              onDeleteClient={handleDeleteClient}
            />
          )}

          {/* BILLING */}
          {app.activeView === "billing" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Quotes & Invoices Log</h1>
                <p className="text-slate-500 text-sm mt-1">Track conversions and status of your billing pipeline.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuotesTable
                  quotes={app.quotes}
                  clients={app.clients}
                  currency={app.settings.currency}
                  onOpenPortal={handleOpenPortal}
                  onShareWhatsApp={handleShareWhatsApp}
                />
                <InvoicesTable
                  invoices={app.invoices}
                  clients={app.clients}
                  currency={app.settings.currency}
                  onMarkPaid={markInvoicePaid}
                  onShareWhatsApp={handleShareWhatsApp}
                />
              </div>
            </div>
          )}

          {/* QUOTE BUILDER */}
          {app.activeView === "builder" && (
            <QuoteBuilderForm
              clients={app.clients}
              quotes={app.quotes}
              currency={app.settings.currency}
              onSubmit={handleQuoteSubmit}
              onCancel={() => app.setActiveView("dashboard")}
            />
          )}

          {/* INVOICE MAKER */}
          {app.activeView === "invoice-maker" && (
            <InvoiceMakerForm settings={app.settings} showToast={showToast} />
          )}

          {/* PAYMENT REMINDERS */}
          {app.activeView === "reminders" && (
            <PaymentReminderForm
              reminder={app.reminder}
              setReminder={app.setReminder}
              settings={app.settings}
              showToast={showToast}
            />
          )}

          {/* HISTORY */}
          {app.activeView === "history" && (
            <HistoryTable
              history={app.history}
              currency={app.settings.currency}
              onToggleStatus={handleToggleHistoryStatus}
              onSendReminder={handleSendReminderFromHistory}
            />
          )}

          {/* SETTINGS */}
          {app.activeView === "settings" && (
            <SettingsForm
              settings={app.settings}
              onSave={handleSaveSettings}
              onCancel={() => app.setActiveView("dashboard")}
            />
          )}

          {/* CLIENT PORTAL */}
          {app.activeView === "client-portal" && (
            <ClientPortal
              quotes={app.quotes}
              invoices={app.invoices}
              clients={app.clients}
              settings={app.settings}
              activeQuoteId={app.activePortalQuoteId}
              setActiveQuoteId={app.setActivePortalQuoteId}
              onAccept={handleAcceptQuote}
              onDecline={handleDeclineQuote}
              onExit={() => app.setActiveView("dashboard")}
              showToast={showToast}
            />
          )}
        </div>
      </main>
    </div>
  );
}
