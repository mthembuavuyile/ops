"use client";

import React, { useState, useCallback } from "react";
import type { Client, Quote, LineItem } from "@/lib/types";
import { formatCurrency, todayISO, futureDateISO } from "@/lib/formatters";
import { calculateSimpleTotal } from "@/lib/calculations";
import { parseItemsFromText, refineDescription } from "@/lib/ai";
import AiButton from "@/components/shared/AiButton";

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

  // AI states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState("");
  const [refiningRowId, setRefiningRowId] = useState<number | null>(null);

  React.useEffect(() => {
    if (!clientId && clients.length > 0) {
      setClientId(clients[0].id);
    }
  }, [clients, clientId]);

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

  // ——— AI: Import from Notes ———
  const handleImportFromNotes = useCallback(async () => {
    if (!importText.trim()) return;
    setImportLoading(true);
    setImportError("");

    const res = await parseItemsFromText(importText, currency);

    if (res.error || !res.result) {
      setImportError(res.error || "Could not parse the text. Try being more specific with quantities and prices.");
      setImportLoading(false);
      return;
    }

    const parsed = res.result;
    if (parsed.line_items && parsed.line_items.length > 0) {
      const newRows: FormRow[] = parsed.line_items.map((item) => ({
        id: ++rowCounter,
        description: item.description || "",
        qty: item.qty || 1,
        rate: item.rate || 0,
      }));
      setRows(newRows);
      if (parsed.notes) {
        setNotes((prev) => prev ? `${prev}\n${parsed.notes}` : parsed.notes);
      }
      setShowImportModal(false);
      setImportText("");
    } else {
      setImportError("No line items found in the text. Try including quantities and prices.");
    }

    setImportLoading(false);
  }, [importText, currency]);

  // ——— AI: Refine Description ———
  const handleRefineDescription = useCallback(async (rowId: number) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row || !row.description.trim()) return;

    setRefiningRowId(rowId);
    const res = await refineDescription(row.description);

    if (res.result) {
      updateRow(rowId, "description", res.result);
    }
    setRefiningRowId(null);
  }, [rows]);

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
      share_token: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `tok-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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
        {clients.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs flex items-center justify-between">
            <span>⚠️ You have no clients added yet. Please add a client from the Clients tab before creating a quote.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="ops-label">Select Client *</label>
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="ops-input" required disabled={clients.length === 0}>
                {clients.length === 0 ? (
                  <option value="">-- Add a Client First --</option>
                ) : (
                  clients.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.prefix})</option>)
                )}
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
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="ops-label mb-0">Line Items</span>
              <div className="flex items-center gap-2">
                <AiButton
                  onClick={() => { setShowImportModal(true); setImportError(""); }}
                  loading={false}
                  label="Import from Notes"
                  icon="fa-solid fa-paste"
                  title="Paste rough text / WhatsApp message and auto-fill line items"
                />
                <button type="button" onClick={addRow} className="ops-btn-secondary !py-1.5 !px-3 !text-xs">
                  <i className="fa-solid fa-plus" /> Add Row
                </button>
              </div>
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
                    <div className="relative">
                      <textarea
                        placeholder={"e.g. Website V2 Redesign\n- Bullet point 1\n- Bullet point 2"}
                        value={row.description}
                        onChange={(e) => updateRow(row.id, "description", e.target.value)}
                        className="ops-input !rounded-lg !pr-10"
                        rows={2}
                        required
                      />
                      {/* AI Refine button — inline in the description field */}
                      {row.description.trim().length > 3 && (
                        <div className="absolute top-1.5 right-1.5">
                          <AiButton
                            onClick={() => handleRefineDescription(row.id)}
                            loading={refiningRowId === row.id}
                            compact
                            title="AI: Expand into professional scope bullets"
                          />
                        </div>
                      )}
                    </div>
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

      {/* ——— AI Import Modal ——— */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowImportModal(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <i className="fa-solid fa-paste text-purple-600" /> Import from Notes
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Paste a WhatsApp message, email, or rough notes with items, quantities, and prices.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="ops-input !min-h-[140px]"
              rows={6}
              placeholder={`e.g.\n3x 100Ah lithium batteries at R4,500 each\n25m of 16mm solar cable at R85/m\n6 hours installation labor at R350/hr\nGive a 5% discount on labor`}
              autoFocus
            />

            {importError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs">
                <i className="fa-solid fa-circle-exclamation mr-1.5" />{importError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="ops-btn-secondary !text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportFromNotes}
                disabled={importLoading || !importText.trim()}
                className="ops-btn-primary !text-xs !py-2.5 disabled:opacity-50 disabled:cursor-wait"
              >
                {importLoading ? (
                  <><i className="fa-solid fa-spinner animate-spin" /> Parsing...</>
                ) : (
                  <><i className="fa-solid fa-wand-magic-sparkles" /> Parse & Fill Line Items</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
