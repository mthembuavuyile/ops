"use client";

import React from "react";
import type { Invoice, Client } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import StatusBadge from "@/components/shared/StatusBadge";

interface InvoicesTableProps {
  invoices: Invoice[];
  clients: Client[];
  currency: string;
  onMarkPaid: (id: string) => void;
  onShareWhatsApp: (type: "invoice", id: string) => void;
}

export default function InvoicesTable({ invoices, clients, currency, onMarkPaid, onShareWhatsApp }: InvoicesTableProps) {
  return (
    <div className="ops-card">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-lg">
          <i className="fa-solid fa-file-invoice text-slate-300 mr-2" />Invoices
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="ops-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th className="text-right">Total</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-slate-400 py-8">No invoices yet.</td></tr>
            ) : (
              invoices.map((inv) => {
                const client = clients.find((c) => c.id === inv.client_id);
                return (
                  <tr key={inv.id}>
                    <td className="font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                    <td className="font-semibold text-slate-700">{client?.name || "Unknown"}</td>
                    <td className="text-right font-bold text-slate-900 font-mono">{formatCurrency(inv.total, currency)}</td>
                    <td><StatusBadge status={inv.status} /></td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {inv.status !== "paid" ? (
                          <button onClick={() => onMarkPaid(inv.id)} className="ops-btn-primary !py-1 !px-2 !text-[11px] !rounded-md">
                            <i className="fa-solid fa-circle-check" /> Collect
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold"><i className="fa-solid fa-check mr-1" />Settled</span>
                        )}
                        <button onClick={() => onShareWhatsApp("invoice", inv.id)} className="ops-btn-whatsapp !py-1 !px-2 !text-[11px] !rounded-md" title="Share via WhatsApp">
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
