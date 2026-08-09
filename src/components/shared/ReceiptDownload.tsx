"use client";

import React, { useState, useCallback } from "react";
import type { Invoice, Client, Settings } from "@/lib/types";
import { formatDateLabel, currencyLabel } from "@/lib/formatters";
import { generatePdfFromElement } from "@/lib/pdf";

interface ReceiptDownloadProps {
  invoice: Invoice;
  client?: Client | null;
  settings: Settings;
  showToast: (msg: string, type?: "info" | "success" | "warning" | "error") => void;
  /** Render as a full button (default) or a compact icon-only button */
  compact?: boolean;
}

export default function ReceiptDownload({ invoice, client, settings, showToast, compact = false }: ReceiptDownloadProps) {
  const [showReceipt, setShowReceipt] = useState(false);

  const accentColor = settings.accent_color || "#051b38";
  const currency = settings.currency || "R";

  const handleDownload = useCallback(async () => {
    setShowReceipt(true);
    // Wait for DOM to render the receipt
    await new Promise((resolve) => setTimeout(resolve, 200));
    showToast("⏳ Generating receipt PDF...", "info");
    const ok = await generatePdfFromElement(`receipt-${invoice.id}`, `Receipt-${invoice.invoice_number}`);
    if (ok) showToast(`🧾 Receipt PDF for ${invoice.invoice_number} downloaded!`, "success");
    else showToast("Failed to generate receipt PDF", "error");
    setShowReceipt(false);
  }, [invoice, showToast]);

  const ps = {
    container: {
      background: "#ffffff",
      color: "#1e293b",
      borderRadius: "16px",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
      padding: "32px",
      maxWidth: "640px",
      width: "100%",
      border: "1px solid #f1f5f9",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: "13px",
      lineHeight: "1.5",
      minHeight: "600px",
      position: "relative" as const,
    } as React.CSSProperties,
    stamp: {
      position: "absolute" as const,
      top: "80px",
      right: "40px",
      transform: "rotate(-18deg)",
      fontSize: "48px",
      fontWeight: 900,
      color: "rgba(16, 185, 129, 0.18)",
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
      pointerEvents: "none" as const,
      userSelect: "none" as const,
      border: "6px solid rgba(16, 185, 129, 0.18)",
      borderRadius: "16px",
      padding: "8px 24px",
      lineHeight: "1",
    } as React.CSSProperties,
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingBottom: "16px",
    } as React.CSSProperties,
    companyTitle: {
      fontSize: "22px",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: accentColor,
    } as React.CSSProperties,
    docLabel: {
      fontSize: "10px",
      color: "#94a3b8",
      marginTop: "4px",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.06em",
    } as React.CSSProperties,
    receiptTitle: {
      fontSize: "18px",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      color: accentColor,
      textAlign: "right" as const,
    } as React.CSSProperties,
    receiptNum: {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#64748b",
      marginTop: "4px",
      textAlign: "right" as const,
    } as React.CSSProperties,
    accentBar: {
      height: "3px",
      width: "100%",
      backgroundColor: accentColor,
      marginBottom: "24px",
    } as React.CSSProperties,
    metaGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "16px",
      marginBottom: "24px",
      borderBottom: "1px solid #f1f5f9",
      paddingBottom: "16px",
    } as React.CSSProperties,
    metaLabel: {
      fontSize: "10px",
      color: "#94a3b8",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.06em",
      marginBottom: "4px",
      display: "block",
    } as React.CSSProperties,
    metaValue: {
      fontWeight: 600,
      color: "#1e293b",
      fontSize: "12px",
    } as React.CSSProperties,
    addressGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      marginBottom: "24px",
      paddingBottom: "24px",
      borderBottom: "1px solid #f1f5f9",
    } as React.CSSProperties,
    addressLabel: {
      fontSize: "10px",
      color: "#94a3b8",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.06em",
      marginBottom: "6px",
      display: "block",
    } as React.CSSProperties,
    addressName: {
      fontWeight: 700,
      color: "#0f172a",
      marginBottom: "4px",
      fontSize: "13px",
    } as React.CSSProperties,
    addressDetail: {
      color: "#475569",
      lineHeight: "1.6",
      whiteSpace: "pre-line" as const,
      fontSize: "11px",
    } as React.CSSProperties,
    table: {
      width: "100%",
      textAlign: "left" as const,
      fontSize: "12px",
      marginBottom: "24px",
      borderCollapse: "collapse" as const,
    } as React.CSSProperties,
    th: {
      paddingBottom: "8px",
      fontSize: "10px",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      color: "#94a3b8",
      borderBottom: "1px solid #e2e8f0",
    } as React.CSSProperties,
    tdDesc: {
      padding: "12px 16px 12px 0",
      borderBottom: "1px solid #f1f5f9",
      fontWeight: 700,
      color: "#1e293b",
    } as React.CSSProperties,
    tdAmount: {
      padding: "12px 0",
      borderBottom: "1px solid #f1f5f9",
      fontFamily: "monospace",
      fontWeight: 700,
      color: "#0f172a",
      textAlign: "right" as const,
    } as React.CSSProperties,
    totalRow: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "32px",
    } as React.CSSProperties,
    totalBox: {
      width: "192px",
    } as React.CSSProperties,
    totalLabel: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: 700,
      color: "#10b981",
      fontSize: "14px",
      borderTop: "1px solid #e2e8f0",
      paddingTop: "8px",
    } as React.CSSProperties,
    paidBanner: {
      background: "#ecfdf5",
      border: "1px solid #a7f3d0",
      borderRadius: "12px",
      padding: "16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "16px",
    } as React.CSSProperties,
    paidIcon: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: "#10b981",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 800,
      fontSize: "16px",
      flexShrink: 0,
    } as React.CSSProperties,
    paidTitle: {
      fontSize: "12px",
      fontWeight: 700,
      color: "#065f46",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
    } as React.CSSProperties,
    paidDate: {
      fontSize: "11px",
      color: "#047857",
      fontFamily: "monospace",
    } as React.CSSProperties,
  };

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={handleDownload}
          className="ops-btn-secondary !py-1 !px-2 !text-[11px] !rounded-md"
          title="Download Receipt PDF"
        >
          <i className="fa-solid fa-receipt" /> Receipt
        </button>
      ) : (
        <button
          type="button"
          onClick={handleDownload}
          className="ops-btn-secondary !py-2 !px-4 !text-xs"
        >
          <i className="fa-solid fa-receipt mr-1" /> Download Receipt
        </button>
      )}

      {/* Hidden receipt element for PDF capture */}
      {showReceipt && (
        <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
          <div id={`receipt-${invoice.id}`} style={ps.container}>
            {/* PAID Watermark */}
            <div style={ps.stamp}>PAID</div>

            {/* Header */}
            <div style={ps.headerRow}>
              <div>
                <div style={ps.companyTitle}>{(settings.company_name || "My Business").toUpperCase()}</div>
                <p style={ps.docLabel}>Payment Receipt</p>
              </div>
              <div>
                <div style={ps.receiptTitle}>Receipt</div>
                <div style={ps.receiptNum}>Ref: {invoice.invoice_number}</div>
              </div>
            </div>

            <div style={ps.accentBar} />

            {/* Paid Confirmation Banner */}
            <div style={ps.paidBanner}>
              <div style={ps.paidIcon}>✓</div>
              <div>
                <div style={ps.paidTitle}>Payment Received</div>
                <div style={ps.paidDate}>
                  {invoice.paid_at ? formatDateLabel(invoice.paid_at) : "Confirmed Paid"}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div style={ps.metaGrid}>
              <div>
                <span style={ps.metaLabel}>Invoice Date</span>
                <div style={ps.metaValue}>{formatDateLabel(invoice.issued_at)}</div>
              </div>
              <div>
                <span style={ps.metaLabel}>Payment Date</span>
                <div style={ps.metaValue}>{invoice.paid_at ? formatDateLabel(invoice.paid_at) : "—"}</div>
              </div>
              <div>
                <span style={ps.metaLabel}>Currency</span>
                <div style={ps.metaValue}>{currencyLabel(currency)}</div>
              </div>
            </div>

            {/* Addresses */}
            <div style={ps.addressGrid}>
              <div>
                <span style={ps.addressLabel}>From</span>
                <div style={ps.addressName}>{settings.company_name}</div>
                <div style={ps.addressDetail}>{settings.company_address}</div>
              </div>
              <div>
                <span style={ps.addressLabel}>Received From</span>
                <div style={ps.addressName}>{client?.name || "Client"}</div>
                <div style={ps.addressDetail}>{client?.address || ""}</div>
              </div>
            </div>

            {/* Items */}
            <table style={ps.table}>
              <thead>
                <tr>
                  <th style={{ ...ps.th, width: "50%" }}>Description</th>
                  <th style={{ ...ps.th, width: "16%", textAlign: "center" }}>Qty</th>
                  <th style={{ ...ps.th, width: "34%", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.line_items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={ps.tdDesc}>{item.description || "—"}</td>
                    <td style={{ ...ps.tdAmount, textAlign: "center" }}>{item.qty}</td>
                    <td style={ps.tdAmount}>{currency} {(item.qty * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div style={ps.totalRow}>
              <div style={ps.totalBox}>
                <div style={ps.totalLabel}>
                  <span>Total Paid:</span>
                  <span>{currency} {invoice.total.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "10px", marginTop: "24px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
              <p>Thank you for your payment. This receipt serves as proof of payment.</p>
              {settings.website && <p style={{ marginTop: "4px" }}>{settings.website}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
