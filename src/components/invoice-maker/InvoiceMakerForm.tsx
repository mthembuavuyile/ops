"use client";

import React, { useState, useCallback, useEffect } from "react";
import type { Settings, Client, Invoice, BusinessAddress, BankAccount } from "@/lib/types";
import { formatDateLabel, todayISO, futureDateISO, currencyLabel } from "@/lib/formatters";
import { generatePdfFromElement } from "@/lib/pdf";
import { refineDescription } from "@/lib/ai";
import AiButton from "@/components/shared/AiButton";

interface InvoiceMakerProps {
  settings: Settings;
  clients?: Client[];
  onSaveClient?: (client: Client) => void;
  onSaveInvoice?: (invoice: Invoice) => void;
  showToast: (msg: string, type?: "info" | "success" | "warning" | "error") => void;
}

interface MakerRow { id: number; description: string; amount: number; }

let makerRowId = 0;

export default function InvoiceMakerForm({ settings, clients = [], onSaveClient, onSaveInvoice, showToast }: InvoiceMakerProps) {
  // AI refine state
  const [refiningRowId, setRefiningRowId] = useState<number | null>(null);

  const [accentColor, setAccentColor] = useState(settings.accent_color || "#051b38");
  const [currency, setCurrency] = useState(settings.currency || "R");
  const [companyName, setCompanyName] = useState(settings.company_name || "My Business");
  
  // Addresses
  const addresses: BusinessAddress[] = settings.business_addresses?.length
    ? settings.business_addresses
    : settings.company_address
    ? [{ id: "addr-default", label: "Primary Address", address: settings.company_address, is_default: true }]
    : [];

  const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || "custom");
  const [companyAddress, setCompanyAddress] = useState(defaultAddr?.address || settings.company_address || "");

  // Clients
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  // Bank Accounts
  const bankAccounts: BankAccount[] = settings.bank_accounts?.length
    ? settings.bank_accounts
    : (settings.bank_name || settings.account_number)
    ? [{
        id: "bank-default",
        label: "Primary Bank Account",
        bank_name: settings.bank_name || "",
        account_name: settings.account_name || "",
        account_number: settings.account_number || "",
        branch_code: settings.branch_code || "",
        payshap_id: settings.payshap_id || "",
        is_default: true,
      }]
    : [];

  const defaultBank = bankAccounts.find((b) => b.is_default) || bankAccounts[0];
  const [selectedBankId, setSelectedBankId] = useState<string>(defaultBank?.id || "custom");
  const [bankName, setBankName] = useState(defaultBank?.bank_name || settings.bank_name || "");
  const [accountName, setAccountName] = useState(defaultBank?.account_name || settings.account_name || "");
  const [accountNumber, setAccountNumber] = useState(defaultBank?.account_number || settings.account_number || "");
  const [branchCode, setBranchCode] = useState(defaultBank?.branch_code || settings.branch_code || "");

  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [invoiceDate, setInvoiceDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(futureDateISO(14));
  const [rows, setRows] = useState<MakerRow[]>([
    { id: ++makerRowId, description: "", amount: 0 },
  ]);
  const [showPreview, setShowPreview] = useState(false);

  // Address selection handler
  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
    if (id === "custom") return;
    const match = addresses.find((a) => a.id === id);
    if (match) {
      setCompanyAddress(match.address);
    }
  };

  // Client selection handler
  const handleClientSelect = (id: string) => {
    setSelectedClientId(id);
    if (!id || id === "custom") return;
    const client = clients.find((c) => c.id === id);
    if (client) {
      setClientName(client.name);
      setClientAddress(client.address || "");
    }
  };

  // Quick save new client handler
  const handleQuickSaveClient = () => {
    if (!clientName.trim()) {
      showToast("Please enter a client name first.", "warning");
      return;
    }
    if (!onSaveClient) return;

    const prefix = clientName.substring(0, 3).toUpperCase();
    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: clientName.trim(),
      prefix: prefix.length === 3 ? prefix : "CLI",
      email: "",
      contact_name: clientName.trim(),
      phone: "",
      address: clientAddress.trim(),
    };

    onSaveClient(newClient);
    setSelectedClientId(newClient.id);
  };

  // Bank Account selection handler
  const handleBankSelect = (id: string) => {
    setSelectedBankId(id);
    if (id === "custom") return;
    const match = bankAccounts.find((b) => b.id === id);
    if (match) {
      setBankName(match.bank_name);
      setAccountName(match.account_name);
      setAccountNumber(match.account_number);
      setBranchCode(match.branch_code);
    }
  };

  const addRow = () => setRows((prev) => [...prev, { id: ++makerRowId, description: "", amount: 0 }]);
  const deleteRow = (id: number) => { if (rows.length > 1) setRows((prev) => prev.filter((r) => r.id !== id)); };
  const updateRow = (id: number, field: keyof MakerRow, value: string | number) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  // AI: Refine a vague line item description
  const handleRefineDescription = useCallback(async (rowId: number) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row || !row.description.trim()) return;
    setRefiningRowId(rowId);
    const res = await refineDescription(row.description);
    if (res.result) {
      setRows((prev) => prev.map((r) => r.id === rowId ? { ...r, description: res.result as string } : r));
    } else if (res.error) {
      showToast(`AI: ${res.error}`, "warning");
    }
    setRefiningRowId(null);
  }, [rows, showToast]);

  const total = rows.reduce((s, r) => s + (r.amount || 0), 0);

  const buildInvoiceRecord = useCallback((): Invoice => {
    const line_items = rows.map((r) => ({
      description: r.description || "Item",
      qty: 1,
      rate: r.amount || 0,
    }));

    return {
      id: `inv-${Date.now()}`,
      client_id: selectedClientId || "",
      quote_id: null,
      invoice_number: invoiceNumber,
      status: "unpaid",
      issued_at: invoiceDate,
      due_at: dueDate,
      line_items,
      subtotal: total,
      vat: 0,
      total,
      notes: "",
      paid_at: null,
    };
  }, [rows, selectedClientId, invoiceNumber, invoiceDate, dueDate, total]);

  const handleDownloadPdf = useCallback(async () => {
    showToast("⏳ Generating PDF...", "info");
    const ok = await generatePdfFromElement("maker-invoice-preview", invoiceNumber || "Invoice");
    if (ok) showToast(`📄 PDF generated for ${invoiceNumber}`, "success");
    else showToast("Failed to generate PDF", "error");
  }, [invoiceNumber, showToast]);

  const handleSaveAndDownload = useCallback(async () => {
    if (!onSaveInvoice) {
      handleDownloadPdf();
      return;
    }
    if (!invoiceNumber.trim()) {
      showToast("Please enter an invoice number.", "warning");
      return;
    }
    const inv = buildInvoiceRecord();
    onSaveInvoice(inv);
    showToast("⏳ Saving invoice & generating PDF...", "info");
    const ok = await generatePdfFromElement("maker-invoice-preview", invoiceNumber || "Invoice");
    if (ok) showToast(`✅ Invoice ${invoiceNumber} saved & PDF downloaded!`, "success");
    else showToast(`✅ Invoice ${invoiceNumber} saved! PDF generation failed.`, "warning");
  }, [onSaveInvoice, invoiceNumber, buildInvoiceRecord, handleDownloadPdf, showToast]);

  // Shared inline styles for the preview (ensures html2canvas captures them correctly)
  const previewStyles = {
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
      minHeight: "700px",
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
    invoiceTitle: {
      fontSize: "18px",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      color: accentColor,
      textAlign: "right" as const,
    } as React.CSSProperties,
    invoiceNum: {
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
    td: {
      padding: "12px 0",
      borderBottom: "1px solid #f1f5f9",
      color: "#334155",
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
      color: "#0f172a",
      fontSize: "14px",
      borderTop: "1px solid #e2e8f0",
      paddingTop: "8px",
    } as React.CSSProperties,
    paymentBox: {
      background: "#f8fafc",
      padding: "16px",
      borderRadius: "12px",
      border: "1px solid #f1f5f9",
      fontSize: "10px",
    } as React.CSSProperties,
    paymentTitle: {
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      marginBottom: "8px",
      color: accentColor,
      fontSize: "11px",
    } as React.CSSProperties,
    paymentGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "6px 16px",
      color: "#475569",
    } as React.CSSProperties,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">New Invoice Generator</h1>
        <p className="text-slate-500 text-sm mt-1">Generate a quick PDF invoice on-the-fly with saved clients, business addresses, and bank accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor */}
        <div className="lg:col-span-5 ops-card-padded space-y-5">
          {/* Style */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-3">Style & Brand</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="ops-label">Accent Color</label>
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-10 w-full border border-slate-200 rounded-lg cursor-pointer" />
              </div>
              <div>
                <label className="ops-label">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="ops-input">
                  <option value="R">R (ZAR)</option>
                  <option value="$">$ (USD)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="€">€ (EUR)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Company & Business Address Selector */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-3">Your Business Details</h3>
            <div className="space-y-3">
              <div><label className="ops-label">Company / Trading Name</label><input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="ops-input" /></div>
              
              {addresses.length > 0 && (
                <div>
                  <label className="ops-label">Select Business Address</label>
                  <select
                    value={selectedAddressId}
                    onChange={(e) => handleAddressSelect(e.target.value)}
                    className="ops-input text-xs font-medium"
                  >
                    {addresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label} {a.is_default ? "★ Primary Default" : ""}
                      </option>
                    ))}
                    <option value="custom">✏️ Custom / Edit Below</option>
                  </select>
                </div>
              )}

              <div>
                <label className="ops-label">Address Displayed on Invoice</label>
                <textarea value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} className="ops-input text-xs" rows={2} />
              </div>
            </div>
          </div>

          {/* Client Details Selector */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Client Details</h3>
              {clients.length > 0 && (
                <span className="text-xs text-slate-400 font-medium">{clients.length} Saved Client{clients.length > 1 ? "s" : ""}</span>
              )}
            </div>
            
            <div className="space-y-3">
              {clients.length > 0 && (
                <div>
                  <label className="ops-label">Select Saved Client</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="ops-input text-xs font-medium"
                  >
                    <option value="">-- Select Saved Client or Type Below --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.contact_name ? `(${c.contact_name})` : ""}
                      </option>
                    ))}
                    <option value="custom">✏️ Custom / Enter New Client</option>
                  </select>
                </div>
              )}

              <div>
                <label className="ops-label">Client Name</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="ops-input" placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="ops-label">Client Address</label>
                <textarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className="ops-input text-xs" rows={2} placeholder="e.g. 12 Main St, Johannesburg" />
              </div>

              {clientName.trim() !== "" && onSaveClient && !clients.some((c) => c.name.toLowerCase() === clientName.trim().toLowerCase()) && (
                <button
                  type="button"
                  onClick={handleQuickSaveClient}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-user-plus text-emerald-600" /> Save &quot;{clientName.trim()}&quot; to Saved Clients
                </button>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-3">Invoice Details</h3>
            <div className="space-y-3">
              <div><label className="ops-label">Invoice Number</label><input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="ops-input font-mono" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="ops-label">Invoice Date</label><input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="ops-input text-xs" /></div>
                <div><label className="ops-label">Due Date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="ops-input text-xs" /></div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Line Items</h3>
              <button type="button" onClick={addRow} className="ops-btn-secondary !py-1 !px-3 !text-xs"><i className="fa-solid fa-plus mr-1" /> Add Row</button>
            </div>
            <div className="space-y-2">
              {rows.map((row) => (
                <div key={row.id} className="flex gap-2 items-center">
                  <div className="flex-1 min-w-0 relative">
                    <input type="text" value={row.description} onChange={(e) => updateRow(row.id, "description", e.target.value)} className="ops-input !text-xs !py-1.5 !pr-9" placeholder="Item description" />
                    {row.description.trim().length > 3 && (
                      <div className="absolute top-1/2 -translate-y-1/2 right-1.5">
                        <AiButton
                          onClick={() => handleRefineDescription(row.id)}
                          loading={refiningRowId === row.id}
                          compact
                          title="AI: Refine into professional description"
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-24 flex-shrink-0"><input type="number" value={row.amount || ""} onChange={(e) => updateRow(row.id, "amount", Number(e.target.value))} className="ops-input !text-xs !py-1.5 text-right font-mono" placeholder="0.00" min={0} step={0.01} /></div>
                  <button type="button" onClick={() => deleteRow(row.id)} className="text-rose-400 hover:text-rose-600 transition-colors flex-shrink-0 p-1"><i className="fa-solid fa-trash-can text-xs" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Account Selector */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-3">Payment & Bank Details</h3>
            <div className="space-y-3">
              {bankAccounts.length > 0 && (
                <div>
                  <label className="ops-label">Select Saved Bank Account</label>
                  <select
                    value={selectedBankId}
                    onChange={(e) => handleBankSelect(e.target.value)}
                    className="ops-input text-xs font-medium"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label} {b.bank_name ? `(${b.bank_name})` : ""} {b.is_default ? "★ Default" : ""}
                      </option>
                    ))}
                    <option value="custom">✏️ Custom / Edit Bank Details</option>
                  </select>
                </div>
              )}

              <div><label className="ops-label">Bank Name</label><input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className="ops-input" /></div>
              <div><label className="ops-label">Account Holder</label><input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="ops-input" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="ops-label">Account Number</label><input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="ops-input font-mono" /></div>
                <div><label className="ops-label">Branch Code</label><input type="text" value={branchCode} onChange={(e) => setBranchCode(e.target.value)} className="ops-input font-mono" /></div>
              </div>
            </div>
          </div>

          {/* Mobile: Toggle Preview + Download */}
          <div className="flex flex-col gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="ops-btn-secondary w-full !py-3"
            >
              <i className={`fa-solid ${showPreview ? "fa-eye-slash" : "fa-eye"}`} />
              {showPreview ? "Hide Preview" : "Preview Invoice"}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {onSaveInvoice && (
              <button type="button" onClick={handleSaveAndDownload} className="ops-btn-primary w-full !py-3">
                <i className="fa-solid fa-floppy-disk" /> Save Invoice & Download PDF
              </button>
            )}
            <button type="button" onClick={handleDownloadPdf} className={`w-full !py-3 ${onSaveInvoice ? 'ops-btn-secondary' : 'ops-btn-primary'}`}>
              <i className="fa-solid fa-file-pdf" /> Download PDF Only
            </button>
          </div>
        </div>

        {/* Live Preview — hidden on mobile unless toggled, always visible on desktop */}
        <div className={`lg:col-span-7 flex justify-center p-4 md:p-8 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto ${showPreview ? "block" : "hidden lg:flex"}`}>
          <div id="maker-invoice-preview" style={previewStyles.container}>
            {/* Header */}
            <div style={previewStyles.headerRow}>
              <div>
                <div style={previewStyles.companyTitle}>{companyName.toUpperCase()}</div>
                <p style={previewStyles.docLabel}>Quick Invoice</p>
              </div>
              <div>
                <div style={previewStyles.invoiceTitle}>Invoice</div>
                <div style={previewStyles.invoiceNum}>No: {invoiceNumber}</div>
              </div>
            </div>

            <div style={previewStyles.accentBar} />

            {/* Dates */}
            <div style={previewStyles.metaGrid}>
              <div>
                <span style={previewStyles.metaLabel}>Date Issued</span>
                <div style={previewStyles.metaValue}>{formatDateLabel(invoiceDate)}</div>
              </div>
              <div>
                <span style={previewStyles.metaLabel}>Due Date</span>
                <div style={previewStyles.metaValue}>{formatDateLabel(dueDate)}</div>
              </div>
              <div>
                <span style={previewStyles.metaLabel}>Currency</span>
                <div style={previewStyles.metaValue}>{currencyLabel(currency)}</div>
              </div>
            </div>

            {/* Addresses */}
            <div style={previewStyles.addressGrid}>
              <div>
                <span style={previewStyles.addressLabel}>From</span>
                <div style={previewStyles.addressName}>{companyName}</div>
                <div style={previewStyles.addressDetail}>{companyAddress}</div>
              </div>
              <div>
                <span style={previewStyles.addressLabel}>Bill To</span>
                <div style={previewStyles.addressName}>{clientName}</div>
                <div style={previewStyles.addressDetail}>{clientAddress}</div>
              </div>
            </div>

            {/* Items */}
            <table style={previewStyles.table}>
              <thead>
                <tr>
                  <th style={{ ...previewStyles.th, width: "66%" }}>Description</th>
                  <th style={{ ...previewStyles.th, width: "34%", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td style={previewStyles.tdDesc}>{row.description || "—"}</td>
                    <td style={previewStyles.tdAmount}>{currency} {(row.amount || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div style={previewStyles.totalRow}>
              <div style={previewStyles.totalBox}>
                <div style={previewStyles.totalLabel}>
                  <span>Total Due:</span>
                  <span>{currency} {total.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            {(bankName || accountName || accountNumber) && (
              <div style={previewStyles.paymentBox}>
                <div style={previewStyles.paymentTitle}>Payment Instructions</div>
                <div style={previewStyles.paymentGrid}>
                  {bankName && <p><strong>Bank:</strong> {bankName}</p>}
                  {accountName && <p><strong>Account Holder:</strong> {accountName}</p>}
                  {accountNumber && <p><strong>Account Number:</strong> {accountNumber}</p>}
                  {branchCode && <p><strong>Branch Code:</strong> {branchCode}</p>}
                  <p style={{ gridColumn: "1 / -1" }}><strong>Reference:</strong> <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#0f172a" }}>{invoiceNumber}</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
