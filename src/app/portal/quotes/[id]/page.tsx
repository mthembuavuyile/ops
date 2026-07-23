"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Quote, Client, Invoice, Settings } from "@/lib/types";
import { getQuotes, getClients, getInvoices, getSettings, saveQuotes, saveInvoices } from "@/lib/data";
import { formatCurrency, formatDateLabel, currencyName, todayISO, futureDateISO } from "@/lib/formatters";

export default function QuotePortal() {
  const params = useParams();
  const quoteIdOrNum = params.id as string;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [linkedInvoice, setLinkedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const s = getSettings();
    setSettings(s);
    const allQuotes = getQuotes();
    const allClients = getClients();
    const allInvoices = getInvoices();

    const found = allQuotes.find(
      (q) => q.id === quoteIdOrNum || q.quote_number === quoteIdOrNum
    );
    if (found) {
      setQuote(found);
      setClient(allClients.find((c) => c.id === found.client_id) || null);
      setAccepted(found.status === "accepted");
      const inv = allInvoices.find((i) => i.quote_id === found.id);
      if (inv) setLinkedInvoice(inv);
    }
    setLoading(false);
  }, [quoteIdOrNum]);

  const handleAccept = () => {
    if (!quote || !client) return;
    const allQuotes = getQuotes();
    const allInvoices = getInvoices();

    const updatedQuotes = allQuotes.map((q) =>
      q.id === quote.id ? { ...q, status: "accepted" as const } : q
    );
    saveQuotes(updatedQuotes);

    const prefix = client.prefix || "INV";
    const clientInvs = allInvoices.filter((i) => i.client_id === quote.client_id);
    const invoiceNum = `${prefix}-2026-${String(clientInvs.length + 1).padStart(3, "0")}`;

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
    saveInvoices([...allInvoices, newInvoice]);

    setQuote({ ...quote, status: "accepted" });
    setAccepted(true);
    setLinkedInvoice(newInvoice);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <i className="fa-solid fa-spinner animate-spin text-2xl text-brand-accent" />
      </div>
    );
  }

  if (!quote || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <i className="fa-solid fa-file-circle-xmark text-4xl text-slate-300" />
          <p className="text-slate-500 font-medium">Quote not found.</p>
        </div>
      </div>
    );
  }

  const accentColor = settings.accent_color || "#051b38";

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="bg-white text-slate-800 rounded-3xl shadow-xl p-6 md:p-12 max-w-4xl mx-auto border border-gray-100 relative overflow-hidden">
        {accepted && (
          <div className="absolute -right-16 -top-1 rotate-45 bg-emerald-500 text-white font-bold py-2 px-16 text-center text-xs uppercase tracking-widest shadow-md">
            Accepted
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-end pb-4">
          <div>
            <div className="text-3xl font-extrabold tracking-tight" style={{ color: accentColor }}>
              {(settings.company_name || "VYLEX").toUpperCase()}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">{settings.website}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-wider" style={{ color: accentColor }}>
              {accepted ? "Invoice" : "Project Quote"}
            </h2>
            <div className="font-mono text-sm text-slate-500 mt-1">
              {linkedInvoice?.invoice_number || quote.quote_number}
            </div>
          </div>
        </div>

        <div className="h-[3px] w-full mb-8" style={{ backgroundColor: accentColor }} />

        {/* Dates */}
        <div className="grid grid-cols-3 gap-6 mb-8 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Date</span>
            <div className="font-semibold text-slate-800 text-sm">{formatDateLabel(linkedInvoice?.issued_at || quote.issued_at)}</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">{accepted ? "Due Date" : "Expiry"}</span>
            <div className="font-semibold text-slate-800 text-sm">{formatDateLabel(linkedInvoice?.due_at || quote.expires_at)}</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Currency</span>
            <div className="font-semibold text-slate-800 text-sm">{currencyName(settings.currency)}</div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-2">From</span>
            <div className="font-bold text-sm mb-1" style={{ color: accentColor }}>{settings.company_name}</div>
            <div className="text-slate-600 space-y-0.5">
              <p>{settings.contact_name}</p>
              <p>{settings.email}</p>
              <p>{settings.phone}</p>
              <p>{settings.company_address}</p>
            </div>
          </div>
          {client && (
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-2">Bill To</span>
              <div className="font-bold text-sm mb-1" style={{ color: accentColor }}>{client.name}</div>
              <div className="text-slate-600 space-y-0.5">
                <p>{client.contact_name}</p>
                <p>{client.phone}</p>
                <p>{client.email}</p>
                <p>{client.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <table className="w-full text-left text-sm border-collapse mb-8">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-bold uppercase text-slate-400">
              <th className="pb-3 w-8/12">Description</th>
              <th className="pb-3 text-center w-1/12">Qty</th>
              <th className="pb-3 text-right w-3/12">Amount</th>
            </tr>
          </thead>
          <tbody>
            {quote.line_items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 text-slate-700 align-top">
                <td className="py-4 pr-4">
                  <div className="font-bold" style={{ color: accentColor }}>{item.description}</div>
                  {item.details && item.details.length > 0 && (
                    <ul className="list-disc pl-4 mt-1.5 space-y-0.5 text-xs text-slate-500">
                      {item.details.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  )}
                </td>
                <td className="py-4 text-center font-mono text-slate-600">{item.qty}</td>
                <td className="py-4 text-right font-mono font-bold text-slate-900">
                  {formatCurrency(item.qty * item.rate, settings.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between text-slate-900 font-bold text-base border-t border-gray-200 pt-2">
              <span>Total Due</span>
              <span>{formatCurrency(quote.total, settings.currency)}</span>
            </div>
          </div>
        </div>

        {/* Accept / Decline */}
        {!accepted && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Review Complete</h4>
              <p className="text-xs text-slate-500 mt-1">Accept to formalise this quote into an invoice.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-white border border-gray-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition text-xs">
                Decline
              </button>
              <button onClick={handleAccept} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow text-xs">
                <i className="fa-solid fa-check mr-1" /> Accept Quote
              </button>
            </div>
          </div>
        )}

        {/* Payment Details */}
        {accepted && (
          <div className="border-t border-gray-200 pt-8">
            <h4 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: accentColor }}>Payment Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <span className="font-bold block mb-1" style={{ color: accentColor }}>{settings.bank_name}</span>
                <p className="text-slate-600">Account Holder: {settings.account_name}</p>
                <p className="text-slate-600">Account Number: {settings.account_number}</p>
                <p className="text-slate-600">Branch Code: {settings.branch_code}</p>
              </div>
              {settings.payshap_id && (
                <div>
                  <span className="font-bold block mb-1" style={{ color: accentColor }}>PayShap</span>
                  <p className="text-slate-600">ID / Cell: {settings.payshap_id}</p>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-4">
              <span className="font-bold" style={{ color: accentColor }}>Reference:</span>{" "}
              <span className="font-mono font-bold text-slate-900">{linkedInvoice?.invoice_number || quote.quote_number}</span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
