"use client";

import React from "react";
import type { HistoryRecord } from "@/lib/types";
import StatusBadge from "@/components/shared/StatusBadge";
import { exportHistoryToCsv } from "@/lib/csv";

interface HistoryTableProps {
  history: HistoryRecord[];
  currency: string;
  onToggleStatus: (id: string) => void;
  onSendReminder: (record: HistoryRecord) => void;
}

export default function HistoryTable({ history, currency, onToggleStatus, onSendReminder }: HistoryTableProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">History & Credits</h1>
        <p className="text-slate-500 text-sm mt-1">Track saved invoices and outstanding credits.</p>
      </div>

      <div className="ops-card">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-lg">
            <i className="fa-solid fa-box-archive text-slate-300 mr-2" />Saved Records
          </h3>
          <button onClick={() => exportHistoryToCsv(history)} className="ops-btn-secondary !text-xs">
            <i className="fa-solid fa-download" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Doc #</th>
                <th>Client</th>
                <th>Date</th>
                <th className="text-right">Total</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-slate-400 py-8">No saved records yet.</td></tr>
              ) : (
                history.map((rec) => (
                  <tr key={rec.id}>
                    <td className="font-mono font-bold text-slate-900">{rec.docNumber}</td>
                    <td className="font-semibold text-slate-700">{rec.clientName}</td>
                    <td className="text-slate-500 font-mono text-xs">{rec.date}</td>
                    <td className="text-right font-bold text-slate-900 font-mono">{currency} {rec.total}</td>
                    <td><StatusBadge status={rec.status} /></td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => onToggleStatus(rec.id)} className="ops-btn-secondary !py-1 !px-2 !text-[11px] !rounded-md">
                          {rec.status === "Paid" ? "Mark Unpaid" : "Mark Paid"}
                        </button>
                        <button onClick={() => onSendReminder(rec)} className="ops-btn-whatsapp !py-1 !px-2 !text-[11px] !rounded-md">
                          <i className="fa-brands fa-whatsapp" /> Remind
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
