"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Invoice, Client, Settings } from "@/lib/types";
import { getInvoices, getClients, getSettings } from "@/lib/data";
import { formatCurrency, formatDateLabel, currencyName } from "@/lib/formatters";

export default function InvoicePortal() {
  const params = useParams();
  const invoiceIdOrNum = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSettings();
    setSettings(s);
    const allInvoices = getInvoices();
    const allClients = getClients();

    const found = allInvoices.find(
      (i) => i.id === invoiceIdOrNum || i.invoice_number === invoiceIdOrNum
    );
    if (found) {
      setInvoice(found);
      setClient(allClients.find((c) => c.id === found.client_id) || null);
    }
    setLoading(false);
  }, [invoiceIdOrNum]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <i className="fa-solid fa-spinner animate-spin text-2xl text-brand-accent" />
      </div>
    );
  }

  if (!invoice || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <i className="fa-solid fa-file-circle-xmark text-4xl text-slate-300" />
          <p className="text-slate-500 font-medium">Invoice not found.</p>
        </div>
      </div>
    );
  }

  const accentColor = settings.accent_color || "#051b38";
  const isPaid = invoice.status === "paid";

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="bg-white text-slate-800 rounded-3xl shadow-xl p-6 md:p-12 max-w-4xl mx-auto border border-gray-100 relative overflow-hidden">
        {isPaid && (
          <div className="absolute -right-16 -top-1 rotate-45 bg-emerald-500 text-white font-bold py-2 px-16 text-center text-xs uppercase tracking-widest shadow-md">
            Paid
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-end pb-4">
          <div>
            <div className="text-3xl font-extrabold tracking-tight" style={{ color: accentColor }}>
              {(settings.company_name || "VYLEX").toUpperCase()}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">{settings.website}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-wider" style={{ color: accentColor }}>Invoice</h2>
            <div className="font-mono text-sm text-slate-500 mt-1">{invoice.invoice_number}</div>
          </div>
        </div>

        <div className="h-[3px] w-full mb-8" style={{ backgroundColor: accentColor }} />

        {/* Dates */}
        <div className="grid grid-cols-3 gap-6 mb-8 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Date Issued</span>
            <div className="font-semibold text-slate-800 text-sm">{formatDateLabel(invoice.issued_at)}</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Due Date</span>
            <div className="font-semibold text-slate-800 text-sm">{formatDateLabel(invoice.due_at)}</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Currency</span>
            <div className="font-semibold text-slate-800 text-sm">{currencyName(settings.currency)}</div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-2">From</span>
            <div className="font-bold text-sm mb-1" style={{ color: accentColor }}>{settings.company_name}</div>
            <div className="text-slate-600 space-y-0.5">
              <p>{settings.contact_name}</p>
              <p>{settings.email}</p>
              <p>{settings.phone}</p>
              <p>{settings.company_address}</p>
            </div>
          </div>
          {client && (
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-2">Bill To</span>
              <div className="font-bold text-sm mb-1" style={{ color: accentColor }}>{client.name}</div>
              <div className="text-slate-600 space-y-0.5">
                <p>{client.contact_name}</p>
                <p>{client.phone}</p>
                <p>{client.email}</p>
                <p>{client.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <table className="w-full text-left text-sm border-collapse mb-8">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-bold uppercase text-slate-400">
              <th className="pb-3 w-8/12">Description</th>
              <th className="pb-3 text-center w-1/12">Qty</th>
              <th className="pb-3 text-right w-3/12">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.line_items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 text-slate-700 align-top">
                <td className="py-4 pr-4">
                  <div className="font-bold" style={{ color: accentColor }}>{item.description}</div>
                  {item.details && item.details.length > 0 && (
                    <ul className="list-disc pl-4 mt-1.5 space-y-0.5 text-xs text-slate-500">
                      {item.details.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  )}
                </td>
                <td className="py-4 text-center font-mono text-slate-600">{item.qty}</td>
                <td className="py-4 text-right font-mono font-bold text-slate-900">
                  {formatCurrency(item.qty * item.rate, settings.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between text-slate-900 font-bold text-base border-t border-gray-200 pt-2">
              <span>{isPaid ? "Total Paid" : "Total Due"}</span>
              <span>{formatCurrency(invoice.total, settings.currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-t border-gray-200 pt-8">
          <h4 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: accentColor }}>Payment Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="font-bold block mb-1" style={{ color: accentColor }}>{settings.bank_name}</span>
              <p className="text-slate-600">Account Holder: {settings.account_name}</p>
              <p className="text-slate-600">Account Number: {settings.account_number}</p>
              <p className="text-slate-600">Branch Code: {settings.branch_code}</p>
            </div>
            {settings.payshap_id && (
              <div>
                <span className="font-bold block mb-1" style={{ color: accentColor }}>PayShap</span>
                <p className="text-slate-600">ID / Cell: {settings.payshap_id}</p>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-4">
            <span className="font-bold" style={{ color: accentColor }}>Reference:</span>{" "}
            <span className="font-mono font-bold text-slate-900">{invoice.invoice_number}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
