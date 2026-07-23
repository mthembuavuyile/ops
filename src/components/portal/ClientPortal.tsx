"use client";

import React, { useMemo } from "react";
import type { Quote, Invoice, Client, Settings } from "@/lib/types";
import { formatCurrency, formatDateLabel, currencyName } from "@/lib/formatters";
import { generatePdfFromElement } from "@/lib/pdf";
import { buildWhatsAppUrl, generateShareMessage } from "@/lib/whatsapp";

interface ClientPortalProps {
  quotes: Quote[];
  invoices: Invoice[];
  clients: Client[];
  settings: Settings;
  activeQuoteId: string;
  setActiveQuoteId: (id: string) => void;
  onAccept: (quoteId: string) => void;
  onDecline: (quoteId: string) => void;
  onExit: () => void;
  showToast: (msg: string, type?: "info" | "success" | "warning" | "error") => void;
}

export default function ClientPortal({
  quotes, invoices, clients, settings,
  activeQuoteId, setActiveQuoteId,
  onAccept, onDecline, onExit, showToast,
}: ClientPortalProps) {
  const quote = quotes.find((q) => q.id === activeQuoteId);
  const client = quote ? clients.find((c) => c.id === quote.client_id) : null;
  const linkedInvoice = quote?.status === "accepted"
    ? invoices.find((i) => i.quote_id === quote.id)
    : null;

  const isAccepted = quote?.status === "accepted";
  const accentColor = settings.accent_color || "#051b38";

  const handlePdf = async () => {
    showToast("⏳ Generating PDF...", "info");
    const docNum = linkedInvoice?.invoice_number || quote?.quote_number || "Document";
    const ok = await generatePdfFromElement("client-invoice-card", docNum);
    if (ok) showToast(`📄 PDF generated for ${docNum}`, "success");
    else showToast("Failed to generate PDF", "error");
  };

  const handleWhatsAppShare = () => {
    if (!quote || !client) return;
    const inv = invoices.find((i) => i.quote_id === quote.id);
    const type = isAccepted && inv ? "invoice" : "quote";
    const docNum = isAccepted && inv ? inv.invoice_number : quote.quote_number;
    const msg = generateShareMessage(type, docNum, client.contact_name || client.name, quote.total, settings);
    const url = buildWhatsAppUrl(client.phone, msg);
    window.open(url, "_blank");
    showToast(`💬 WhatsApp share link opened for ${docNum}!`, "success");
  };

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="bg-amber-50 border border-amber-200/60 text-amber-700 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print-hide">
        <div>
          <div className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <i className="fa-solid fa-display" /> Client Portal Preview
          </div>
          <p className="text-xs opacity-80 mt-1">Simulates what your client sees when they open the link.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleWhatsAppShare} className="ops-btn-whatsapp !text-xs !py-2 !px-4">
            <i className="fa-brands fa-whatsapp" /> Share
          </button>
          <button onClick={handlePdf} className="ops-btn-primary !text-xs !py-2 !px-4">
            <i className="fa-solid fa-file-pdf" /> PDF
          </button>
          <button onClick={onExit} className="ops-btn-secondary !text-xs !py-2 !px-4">
            <i className="fa-solid fa-arrow-left" /> Exit
          </button>
        </div>
      </div>

      {/* Selector */}
      <div className="flex items-center gap-3 print-hide">
        <span className="text-xs text-slate-400 font-bold uppercase">Viewing:</span>
        <select
          value={activeQuoteId}
          onChange={(e) => setActiveQuoteId(e.target.value)}
          className="ops-input !w-auto !text-xs"
        >
          {quotes.map((q) => {
            const c = clients.find((cl) => cl.id === q.client_id);
            return <option key={q.id} value={q.id}>{q.quote_number} — {c?.name || "Unknown"} ({q.status})</option>;
          })}
        </select>
      </div>

      {/* Document Card */}
      {quote && client && (
        <div
          id="client-invoice-card"
          className="bg-white text-slate-800 rounded-3xl shadow-xl p-6 md:p-12 max-w-4xl mx-auto border border-gray-100 relative overflow-hidden"
        >
          {/* Accepted Watermark */}
          {isAccepted && (
            <div className="absolute -right-16 -top-1 rotate-45 bg-emerald-500 text-white font-bold py-2 px-16 text-center text-xs uppercase tracking-widest shadow-md print-hide">
              Accepted
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-end pb-4">
            <div>
              <div className="text-3xl font-extrabold tracking-tight" style={{ color: accentColor }}>
                {(settings.company_name || "VYLEX").toUpperCase()}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">{settings.website || ""}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                {isAccepted ? "Invoice" : "Project Quote"}
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
              <div className="font-semibold text-slate-800 text-sm">
                {formatDateLabel(linkedInvoice?.issued_at || quote.issued_at)}
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                {isAccepted ? "Due Date" : "Expiry Date"}
              </span>
              <div className="font-semibold text-slate-800 text-sm">
                {formatDateLabel(linkedInvoice?.due_at || quote.expires_at)}
              </div>
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
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold uppercase text-slate-400">
                  <th className="pb-3 w-8/12 font-semibold">Description</th>
                  <th className="pb-3 text-center w-1/12 font-semibold">Qty</th>
                  <th className="pb-3 text-right w-3/12 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quote.line_items.map((item, idx) => {
                  const total = item.qty * item.rate;
                  return (
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
                        {formatCurrency(total, settings.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(quote.total, settings.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-base border-t border-gray-200 pt-2">
                <span>Total Due</span>
                <span>{formatCurrency(quote.total, settings.currency)}</span>
              </div>
            </div>
          </div>

          {/* Accept/Decline */}
          {!isAccepted && (
            <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 print-hide">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Review Completed</h4>
                <p className="text-xs text-slate-500 mt-1">Ready to proceed? Accept to formalise this quote.</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={() => onDecline(quote.id)} className="ops-btn-danger w-full md:w-auto !py-2.5 !px-5 !text-xs !rounded-xl">
                  Decline Quote
                </button>
                <button onClick={() => onAccept(quote.id)} className="ops-btn-primary w-full md:w-auto !py-2.5 !px-6 !text-xs !rounded-xl bg-emerald-600 hover:bg-emerald-700">
                  <i className="fa-solid fa-check" /> Accept Project Quote
                </button>
              </div>
            </div>
          )}

          {/* Payment Details (shown when accepted) */}
          {isAccepted && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: accentColor }}>Payment Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs mb-4">
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
              <div className="text-xs text-slate-600">
                <p>
                  <span className="font-bold" style={{ color: accentColor }}>Reference:</span>{" "}
                  <span className="font-mono font-bold text-slate-900">
                    *{linkedInvoice?.invoice_number || quote.quote_number}*
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
