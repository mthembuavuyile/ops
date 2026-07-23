"use client";

import React from "react";
import type { Quote, Client } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import StatusBadge from "@/components/shared/StatusBadge";

interface QuotesTableProps {
  quotes: Quote[];
  clients: Client[];
  currency: string;
  onOpenPortal: (quoteId: string) => void;
  onShareWhatsApp: (type: "quote", id: string) => void;
}

export default function QuotesTable({ quotes, clients, currency, onOpenPortal, onShareWhatsApp }: QuotesTableProps) {
  return (
    <div className="ops-card">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 text-lg">
          <i className="fa-solid fa-file-lines text-slate-300 mr-2" />Quotes
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="ops-table">
          <thead>
            <tr>
              <th>Quote #</th>
              <th>Client</th>
              <th className="text-right">Total</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-slate-400 py-8">No quotes yet.</td></tr>
            ) : (
              quotes.map((q) => {
                const client = clients.find((c) => c.id === q.client_id);
                return (
                  <tr key={q.id}>
                    <td className="font-mono font-bold text-slate-900">{q.quote_number}</td>
                    <td className="font-semibold text-slate-700">{client?.name || "Unknown"}</td>
                    <td className="text-right font-bold text-slate-900 font-mono">{formatCurrency(q.total, currency)}</td>
                    <td><StatusBadge status={q.status} /></td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => onOpenPortal(q.id)} className="ops-btn-secondary !py-1 !px-2 !text-[11px] !rounded-md" title="Open Portal Preview">
                          <i className="fa-solid fa-arrow-up-right-from-square" /> Open
                        </button>
                        <button
                          onClick={() => {
                            const link = `${window.location.origin}/portal/quotes/${q.share_token || q.id}`;
                            navigator.clipboard.writeText(link);
                            alert("🔗 Unguessable portal link copied to clipboard!");
                          }}
                          className="ops-btn-secondary !py-1 !px-2 !text-[11px] !rounded-md"
                          title="Copy Unguessable Link"
                        >
                          <i className="fa-solid fa-link" /> Link
                        </button>
                        <button onClick={() => onShareWhatsApp("quote", q.id)} className="ops-btn-whatsapp !py-1 !px-2 !text-[11px] !rounded-md" title="Share via WhatsApp">
                          <i className="fa-brands fa-whatsapp" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
