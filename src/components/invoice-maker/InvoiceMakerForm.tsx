"use client";

import React, { useState, useCallback, useEffect } from "react";
import type { Settings } from "@/lib/types";
import { formatCurrency, formatDateLabel, todayISO, futureDateISO, currencyLabel } from "@/lib/formatters";
import { generatePdfFromElement } from "@/lib/pdf";

interface InvoiceMakerProps {
  settings: Settings;
  showToast: (msg: string, type?: "info" | "success" | "warning" | "error") => void;
}

interface MakerRow { id: number; description: string; amount: number; }

let makerRowId = 0;

export default function InvoiceMakerForm({ settings, showToast }: InvoiceMakerProps) {
  const [accentColor, setAccentColor] = useState(settings.accent_color || "#051b38");
  const [currency, setCurrency] = useState(settings.currency || "R");
  const [companyName, setCompanyName] = useState(settings.company_name || "My Business");
  const [companyAddress, setCompanyAddress] = useState(settings.company_address || "");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [invoiceDate, setInvoiceDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(futureDateISO(14));
  const [bankName, setBankName] = useState(settings.bank_name || "");
  const [accountName, setAccountName] = useState(settings.account_name || "");
  const [accountNumber, setAccountNumber] = useState(settings.account_number || "");
  const [branchCode, setBranchCode] = useState(settings.branch_code || "");
  const [rows, setRows] = useState<MakerRow[]>([
    { id: ++makerRowId, description: "", amount: 0 },
  ]);

  const addRow = () => setRows((prev) => [...prev, { id: ++makerRowId, description: "", amount: 0 }]);
  const deleteRow = (id: number) => { if (rows.length > 1) setRows((prev) => prev.filter((r) => r.id !== id)); };
  const updateRow = (id: number, field: keyof MakerRow, value: string | number) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const total = rows.reduce((s, r) => s + (r.amount || 0), 0);

  const handleDownloadPdf = useCallback(async () => {
    showToast("⏳ Generating PDF...", "info");
    const ok = await generatePdfFromElement("maker-invoice-preview", invoiceNumber || "Invoice");
    if (ok) showToast(`📄 PDF generated for ${invoiceNumber}`, "success");
    else showToast("Failed to generate PDF", "error");
  }, [invoiceNumber, showToast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Quick Invoice Maker</h1>
        <p className="text-slate-500 text-sm mt-1">Generate a quick PDF invoice on-the-fly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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

          {/* Company */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-3">Your Details</h3>
            <div className="space-y-3">
              <div><label className="ops-label">Company / Name</label><input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="ops-input" /></div>
              <div><label className="ops-label">Address</label><textarea value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} className="ops-input" rows={2} /></div>
            </div>
          </div>

          {/* Client */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-3">Client Details</h3>
            <div className="space-y-3">
              <div><label className="ops-label">Client Name</label><input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="ops-input" /></div>
              <div><label className="ops-label">Client Address</label><textarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className="ops-input" rows={2} /></div>
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
                <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-7"><input type="text" value={row.description} onChange={(e) => updateRow(row.id, "description", e.target.value)} className="ops-input !text-xs !py-1.5" placeholder="Item description" /></div>
                  <div className="col-span-3"><input type="number" value={row.amount || ""} onChange={(e) => updateRow(row.id, "amount", Number(e.target.value))} className="ops-input !text-xs !py-1.5 text-right font-mono" placeholder="0.00" min={0} step={0.01} /></div>
                  <div className="col-span-2 text-center"><button type="button" onClick={() => deleteRow(row.id)} className="text-rose-400 hover:text-rose-600 transition-colors"><i className="fa-solid fa-trash-can text-xs" /></button></div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-3">Payment Details</h3>
            <div className="space-y-3">
              <div><label className="ops-label">Bank Name</label><input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className="ops-input" /></div>
              <div><label className="ops-label">Account Holder</label><input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="ops-input" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="ops-label">Account Number</label><input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="ops-input font-mono" /></div>
                <div><label className="ops-label">Branch Code</label><input type="text" value={branchCode} onChange={(e) => setBranchCode(e.target.value)} className="ops-input font-mono" /></div>
              </div>
            </div>
          </div>

          <button type="button" onClick={handleDownloadPdf} className="ops-btn-primary w-full !py-3">
            <i className="fa-solid fa-file-pdf" /> Download PDF Invoice
          </button>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-7 flex justify-center p-4 md:p-8 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
          <div id="maker-invoice-preview" className="bg-white text-slate-800 rounded-2xl shadow-xl p-8 max-w-2xl w-full border border-gray-100 text-sm" style={{ minHeight: 700 }}>
            {/* Header */}
            <div className="flex justify-between items-start pb-4">
              <div>
                <div className="text-2xl font-extrabold tracking-tight" style={{ color: accentColor }}>{companyName.toUpperCase()}</div>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">Quick Invoice</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold uppercase tracking-wider" style={{ color: accentColor }}>Invoice</h2>
                <div className="font-mono text-xs text-slate-500 mt-1">No: {invoiceNumber}</div>
              </div>
            </div>

            <div className="h-[3px] w-full mb-6" style={{ backgroundColor: accentColor }} />

            {/* Dates */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-[11px] border-b border-gray-100 pb-4">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Date Issued</span>
                <div className="font-semibold text-slate-800">{formatDateLabel(invoiceDate)}</div>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Due Date</span>
                <div className="font-semibold text-slate-800">{formatDateLabel(dueDate)}</div>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Currency</span>
                <div className="font-semibold text-slate-800">{currencyLabel(currency)}</div>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100 text-[11px]">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1.5">From</span>
                <div className="font-bold text-slate-900 mb-1">{companyName}</div>
                <div className="text-slate-600 leading-relaxed whitespace-pre-line">{companyAddress}</div>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Bill To</span>
                <div className="font-bold text-slate-900 mb-1">{clientName}</div>
                <div className="text-slate-600 leading-relaxed whitespace-pre-line">{clientAddress}</div>
              </div>
            </div>

            {/* Items */}
            <table className="w-full text-left text-xs mb-6 border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-slate-400 font-bold uppercase">
                  <th className="pb-2 w-8/12 font-semibold">Description</th>
                  <th className="pb-2 text-right w-4/12 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 text-slate-700">
                    <td className="py-3 pr-4 font-bold text-slate-800">{row.description || "—"}</td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900">{currency} {(row.amount || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end mb-8">
              <div className="w-48 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-900 font-bold text-sm border-t border-gray-200 pt-2">
                  <span>Total Due:</span>
                  <span>{currency} {total.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            {(bankName || accountName || accountNumber) && (
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 text-[10px]">
                <h4 className="font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Payment Instructions</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-slate-600">
                  {bankName && <p><strong>Bank:</strong> {bankName}</p>}
                  {accountName && <p><strong>Account Holder:</strong> {accountName}</p>}
                  {accountNumber && <p><strong>Account Number:</strong> {accountNumber}</p>}
                  {branchCode && <p><strong>Branch Code:</strong> {branchCode}</p>}
                  <p className="col-span-2"><strong>Reference:</strong> <span className="font-mono font-bold text-slate-900">{invoiceNumber}</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
