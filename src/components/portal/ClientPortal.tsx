"use client";

import React from "react";
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
    const shareId = isAccepted && inv ? inv.id : (quote.share_token || quote.id);
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const msg = generateShareMessage(type, docNum, client.contact_name || client.name, quote.total, settings, baseUrl, shareId);
    const url = buildWhatsAppUrl(client.phone, msg);
    window.open(url, "_blank");
    showToast(`💬 WhatsApp share link opened for ${docNum}!`, "success");
  };

  // Inline styles for the PDF-capturable document card
  const s = {
    card: {
      background: "#ffffff",
      color: "#1e293b",
      borderRadius: "24px",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
      padding: "32px",
      maxWidth: "900px",
      margin: "0 auto",
      border: "1px solid #f1f5f9",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative" as const,
      overflow: "hidden",
    } as React.CSSProperties,
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "16px" } as React.CSSProperties,
    companyName: { fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em", color: accentColor } as React.CSSProperties,
    website: { fontSize: "12px", color: "#94a3b8", marginTop: "4px", fontWeight: 500 } as React.CSSProperties,
    docTitle: { fontSize: "18px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: accentColor, textAlign: "right" as const } as React.CSSProperties,
    docNum: { fontFamily: "monospace", fontSize: "13px", color: "#64748b", marginTop: "4px", textAlign: "right" as const } as React.CSSProperties,
    accentBar: { height: "3px", width: "100%", backgroundColor: accentColor, marginBottom: "32px" } as React.CSSProperties,
    metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "32px", fontSize: "12px" } as React.CSSProperties,
    metaLabel: { fontSize: "10px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "4px", display: "block" } as React.CSSProperties,
    metaValue: { fontWeight: 600, color: "#1e293b", fontSize: "13px" } as React.CSSProperties,
    addressGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" } as React.CSSProperties,
    addressLabel: { fontSize: "10px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "8px", display: "block" } as React.CSSProperties,
    addressName: { fontWeight: 700, color: accentColor, marginBottom: "4px", fontSize: "13px" } as React.CSSProperties,
    addressDetail: { color: "#475569", lineHeight: "1.6", fontSize: "11px" } as React.CSSProperties,
    table: { width: "100%", textAlign: "left" as const, fontSize: "13px", marginBottom: "32px", borderCollapse: "collapse" as const } as React.CSSProperties,
    th: { paddingBottom: "12px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase" as const, color: "#94a3b8", borderBottom: "1px solid #e2e8f0" } as React.CSSProperties,
    tdDesc: { padding: "16px 16px 16px 0", borderBottom: "1px solid #f1f5f9", fontWeight: 700, color: accentColor } as React.CSSProperties,
    tdQty: { padding: "16px 0", borderBottom: "1px solid #f1f5f9", fontFamily: "monospace", color: "#475569", textAlign: "center" as const } as React.CSSProperties,
    tdAmount: { padding: "16px 0", borderBottom: "1px solid #f1f5f9", fontFamily: "monospace", fontWeight: 700, color: "#0f172a", textAlign: "right" as const } as React.CSSProperties,
    totalBox: { display: "flex", justifyContent: "flex-end", marginBottom: "48px" } as React.CSSProperties,
    totalInner: { width: "288px" } as React.CSSProperties,
    subtotalRow: { display: "flex", justifyContent: "space-between", color: "#475569", fontSize: "13px", marginBottom: "8px" } as React.CSSProperties,
    grandTotalRow: { display: "flex", justifyContent: "space-between", color: "#0f172a", fontWeight: 700, fontSize: "16px", borderTop: "1px solid #e2e8f0", paddingTop: "8px" } as React.CSSProperties,
    paymentSection: { marginTop: "32px", borderTop: "1px solid #e2e8f0", paddingTop: "32px" } as React.CSSProperties,
    paymentTitle: { fontWeight: 700, fontSize: "11px", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "16px", color: accentColor } as React.CSSProperties,
    paymentGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", fontSize: "12px", marginBottom: "16px" } as React.CSSProperties,
    bankName: { fontWeight: 700, marginBottom: "4px", color: accentColor, display: "block" } as React.CSSProperties,
    paymentDetail: { color: "#475569", lineHeight: "1.8" } as React.CSSProperties,
    refLine: { fontSize: "12px", color: "#475569" } as React.CSSProperties,
    refBold: { fontFamily: "monospace", fontWeight: 700, color: "#0f172a" } as React.CSSProperties,
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
        <div className="flex flex-wrap gap-2">
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
      {quotes.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 print-hide">
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
      )}

      {/* Empty State */}
      {(!quote || !client) && (
        <div style={{ ...s.card, textAlign: "center", padding: "48px 32px" }}>
          <i className="fa-solid fa-folder-open text-4xl text-slate-300 block" style={{ marginBottom: "12px" }} />
          <h3 style={{ fontWeight: 700, color: "#334155", fontSize: "18px", marginBottom: "8px" }}>No Active Quote to Display</h3>
          <p style={{ fontSize: "12px", color: "#94a3b8", maxWidth: "400px", margin: "0 auto" }}>
            Create a quote from the Quote Builder to preview how your clients view and accept quotes in their portal.
          </p>
        </div>
      )}

      {/* Document Card — fully inline styled for PDF capture */}
      {quote && client && (
        <div id="client-invoice-card" style={s.card}>
          {/* Header */}
          <div style={s.headerRow}>
            <div>
              <div style={s.companyName}>
                {(settings.company_name || "VYLEX").toUpperCase()}
              </div>
              <p style={s.website}>{settings.website || ""}</p>
            </div>
            <div>
              <div style={s.docTitle}>
                {isAccepted ? "Invoice" : "Project Quote"}
              </div>
              <div style={s.docNum}>
                {linkedInvoice?.invoice_number || quote.quote_number}
              </div>
            </div>
          </div>

          <div style={s.accentBar} />

          {/* Dates */}
          <div style={s.metaGrid}>
            <div>
              <span style={s.metaLabel}>Date</span>
              <div style={s.metaValue}>
                {formatDateLabel(linkedInvoice?.issued_at || quote.issued_at)}
              </div>
            </div>
            <div>
              <span style={s.metaLabel}>
                {isAccepted ? "Due Date" : "Expiry Date"}
              </span>
              <div style={s.metaValue}>
                {formatDateLabel(linkedInvoice?.due_at || quote.expires_at)}
              </div>
            </div>
            <div>
              <span style={s.metaLabel}>Currency</span>
              <div style={s.metaValue}>{currencyName(settings.currency)}</div>
            </div>
          </div>

          {/* Addresses */}
          <div style={s.addressGrid}>
            <div>
              <span style={s.addressLabel}>From</span>
              <div style={s.addressName}>{settings.company_name}</div>
              <div style={s.addressDetail}>
                <p>{settings.contact_name}</p>
                <p>{settings.email}</p>
                <p>{settings.phone}</p>
                <p>{settings.company_address}</p>
              </div>
            </div>
            <div>
              <span style={s.addressLabel}>Bill To</span>
              <div style={s.addressName}>{client.name}</div>
              <div style={s.addressDetail}>
                <p>{client.contact_name}</p>
                <p>{client.phone}</p>
                <p>{client.email}</p>
                <p>{client.address}</p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: "66%" }}>Description</th>
                <th style={{ ...s.th, width: "10%", textAlign: "center" }}>Qty</th>
                <th style={{ ...s.th, width: "24%", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {quote.line_items.map((item, idx) => {
                const lineTotal = item.qty * item.rate;
                return (
                  <tr key={idx}>
                    <td style={s.tdDesc}>
                      {item.description}
                      {item.details && item.details.length > 0 && (
                        <ul style={{ listStyleType: "disc", paddingLeft: "16px", marginTop: "6px", color: "#64748b", fontSize: "11px", fontWeight: 400 }}>
                          {item.details.map((d, i) => <li key={i} style={{ marginBottom: "2px" }}>{d}</li>)}
                        </ul>
                      )}
                    </td>
                    <td style={s.tdQty}>{item.qty}</td>
                    <td style={s.tdAmount}>{formatCurrency(lineTotal, settings.currency)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div style={s.totalBox}>
            <div style={s.totalInner}>
              <div style={s.subtotalRow}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>{formatCurrency(quote.total, settings.currency)}</span>
              </div>
              <div style={s.grandTotalRow}>
                <span>Total Due</span>
                <span>{formatCurrency(quote.total, settings.currency)}</span>
              </div>
            </div>
          </div>

          {/* Accept/Decline (only in preview, hidden from PDF) */}
          {!isAccepted && (
            <div className="print-hide" style={{ marginTop: "32px", background: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
              <div>
                <h4 style={{ fontWeight: 700, color: "#0f172a", fontSize: "13px" }}>Review Completed</h4>
                <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Ready to proceed? Accept to formalise this quote.</p>
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
            <div style={s.paymentSection}>
              <div style={s.paymentTitle}>Payment Details</div>
              <div style={s.paymentGrid}>
                <div>
                  <span style={s.bankName}>{settings.bank_name}</span>
                  <div style={s.paymentDetail}>
                    <p>Account Holder: {settings.account_name}</p>
                    <p>Account Number: {settings.account_number}</p>
                    <p>Branch Code: {settings.branch_code}</p>
                  </div>
                </div>
                {settings.payshap_id && (
                  <div>
                    <span style={s.bankName}>PayShap</span>
                    <div style={s.paymentDetail}>
                      <p>ID / Cell: {settings.payshap_id}</p>
                    </div>
                  </div>
                )}
              </div>
              <div style={s.refLine}>
                <span style={{ fontWeight: 700, color: accentColor }}>Reference:</span>{" "}
                <span style={s.refBold}>
                  {linkedInvoice?.invoice_number || quote.quote_number}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
