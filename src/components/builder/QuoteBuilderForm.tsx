"use client";

import React, { useState, useCallback } from "react";
import type { Client, Quote, LineItem } from "@/lib/types";
import { formatCurrency, todayISO, futureDateISO } from "@/lib/formatters";
import { calculateSimpleTotal } from "@/lib/calculations";

interface QuoteBuilderFormProps {
  clients: Client[];
  quotes: Quote[];
  currency: string;
  onSubmit: (quote: Quote) => void;
  onCancel: () => void;
}

interface FormRow {
  id: number;
  description: string;
  qty: number;
  rate: number;
}

let rowCounter = 0;

export default function QuoteBuilderForm({ clients, quotes, currency, onSubmit, onCancel }: QuoteBuilderFormProps) {
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [expiryDays, setExpiryDays] = useState(14);
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState<FormRow[]>([{ id: ++rowCounter, description: "", qty: 1, rate: 0 }]);

  const quoteNumber = `Q-2026-${String(quotes.length + 1).padStart(3, "0")}`;

  const addRow = () => setRows((prev) => [...prev, { id: ++rowCounter, description: "", qty: 1, rate: 0 }]);

  const deleteRow = (id: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: number, field: keyof FormRow, value: string | number) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const subtotal = calculateSimpleTotal(rows);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const line_items: LineItem[] = rows.map((r) => {
      const lines = r.description.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
      const description = lines[0] || "";
      const details = lines.slice(1).map((l) => l.replace(/^[-*•]\s*/, ""));
      return { description, qty: r.qty, rate: r.rate, details };
    });

    const newQuote: Quote = {
      id: `q-${Date.now()}`,
      client_id: clientId,
      quote_number: quoteNumber,
      status: "sent",
      issued_at: todayISO(),
      expires_at: futureDateISO(expiryDays),
      line_items,
      subtotal,
      vat: 0,
      total: subtotal,
      notes,
    };

    onSubmit(newQuote);
  }, [clientId, expiryDays, notes, rows, quoteNumber, subtotal, onSubmit]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Create a Quote</h1>
        <p className="text-slate-500 text-sm mt-1">Compile custom line items. Auto-calculates totals instantly.</p>
      </div>

      <div className="ops-card-padded">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="ops-label">Select Client *</label>
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="ops-input" required>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.prefix})</option>)}
              </select>
            </div>
            <div>
              <label className="ops-label">Expiry Period *</label>
              <select value={expiryDays} onChange={(e) => setExpiryDays(Number(e.target.value))} className="ops-input" required>
                <option value={7}>Valid for 7 Days</option>
                <option value={14}>Valid for 14 Days</option>
                <option value={30}>Valid for 30 Days</option>
              </select>
            </div>
            <div>
              <label className="ops-label">Quote Number (Auto)</label>
              <div className="ops-input bg-slate-50 text-slate-500 font-mono">{quoteNumber}</div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="ops-label mb-0">Line Items</span>
              <button type="button" onClick={addRow} className="ops-btn-secondary !py-1.5 !px-3 !text-xs">
                <i className="fa-solid fa-plus" /> Add Row
              </button>
            </div>

            <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold uppercase text-slate-400 px-2">
              <div className="col-span-7">Description</div>
              <div className="col-span-1 text-center">Qty</div>
              <div className="col-span-3 text-right">Unit Rate ({currency})</div>
              <div className="col-span-1 text-center">Del</div>
            </div>

            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-12 gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100 md:bg-transparent md:border-none md:p-0">
                  <div className="col-span-12 md:col-span-7">
                    <textarea
                      placeholder={"e.g. Website V2 Redesign\n- Bullet point 1\n- Bullet point 2"}
                      value={row.description}
                      onChange={(e) => updateRow(row.id, "description", e.target.value)}
                      className="ops-input !rounded-lg"
                      rows={2}
                      required
                    />
                  </div>
                  <div className="col-span-4 md:col-span-1">
                    <input type="number" value={row.qty} min={1} onChange={(e) => updateRow(row.id, "qty", Number(e.target.value))} className="ops-input text-center" required />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <input type="number" value={row.rate || ""} min={0} placeholder="8500" onChange={(e) => updateRow(row.id, "rate", Number(e.target.value))} className="ops-input text-right font-mono" required />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                    <button type="button" onClick={() => deleteRow(row.id)} className="text-rose-400 hover:text-rose-600 transition-colors p-2" title="Delete row">
                      <i className="fa-solid fa-trash-can" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="ops-label">Notes / Terms (Optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="ops-input" rows={2} placeholder="e.g. Standard 50% deposit required upon project sign-off." />
          </div>

          {/* Summary */}
          <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-xs text-slate-400">South African Tax Status:</div>
              <div className="text-sm font-semibold text-amber-600">VAT exempt (Under R1M threshold)</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[280px] space-y-2">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-900">{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>VAT (0%):</span>
                <span className="font-medium text-slate-900">{formatCurrency(0, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-lg border-t border-slate-200 pt-2">
                <span>Grand Total:</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="ops-btn-secondary">Cancel</button>
            <button type="submit" className="ops-btn-primary !py-3">
              <i className="fa-solid fa-paper-plane" /> Save & Generate Quote Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
