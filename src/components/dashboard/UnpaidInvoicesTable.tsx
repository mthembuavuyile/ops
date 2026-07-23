"use client";

import React from "react";
import type { Invoice, Client } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import StatusBadge from "@/components/shared/StatusBadge";

interface UnpaidInvoicesTableProps {
  invoices: Invoice[];
  clients: Client[];
  currency: string;
  onMarkPaid: (id: string) => void;
}

export default function UnpaidInvoicesTable({ invoices, clients, currency, onMarkPaid }: UnpaidInvoicesTableProps) {
  const today = new Date().toISOString().split("T")[0];
  const unpaid = invoices.filter((inv) => inv.status === "unpaid");

  return (
    <div className="ops-card">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 text-lg">Invoices Awaiting Collection</h3>
        <span className="text-xs text-amber-600 font-mono font-bold uppercase">Actions Required</span>
      </div>
      <div className="overflow-x-auto">
        <table className="ops-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Due Date</th>
              <th className="text-right">Amount</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {unpaid.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-slate-400 py-8">No active invoices outstanding. Great job!</td></tr>
            ) : (
              unpaid.map((inv) => {
                const client = clients.find((c) => c.id === inv.client_id);
                const isOverdue = inv.due_at < today;
                return (
                  <tr key={inv.id}>
                    <td className="font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                    <td className="font-semibold text-slate-700">{client?.name || "Unknown"}</td>
                    <td className="text-slate-500 font-mono">{inv.due_at}</td>
                    <td className="text-right font-bold text-slate-900 font-mono">{formatCurrency(inv.total, currency)}</td>
                    <td><StatusBadge status={isOverdue ? "overdue" : "unpaid"} /></td>
                    <td className="text-center">
                      <button onClick={() => onMarkPaid(inv.id)} className="ops-btn-primary !py-1.5 !px-3 !text-xs !rounded-lg">
                        <i className="fa-solid fa-circle-check" /> Mark Paid
                      </button>
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
