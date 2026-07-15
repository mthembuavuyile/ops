"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Client {
  id: string;
  name: string;
  prefix: string;
  email: string;
  contact_name: string;
  phone: string;
  address: string;
}

interface LineItem {
  description: string;
  qty: number;
  rate: number;
  details?: string[];
}

interface Invoice {
  id: string;
  client_id: string;
  quote_id: string | null;
  invoice_number: string;
  status: "unpaid" | "paid" | "overdue" | "cancelled";
  issued_at: string;
  due_at: string;
  line_items: LineItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
  paid_at?: string | null;
}

interface Settings {
  company_name: string;
  company_address: string;
  contact_name: string;
  phone: string;
  email: string;
  website: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  branch_code: string;
  payshap_id: string;
  accent_color: string;
  currency: string;
}

export default function InvoicePortal() {
  const params = useParams();
  const router = useRouter();
  const invoiceIdOrNum = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign / Payment Simulations
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadInvoiceData();
  }, [invoiceIdOrNum]);

  const loadInvoiceData = async () => {
    setLoading(true);

    // 1. Fetch settings
    let finalSettings: Settings;
    const localSettings = localStorage.getItem("vylex_ops_settings");
    if (localSettings) {
      finalSettings = JSON.parse(localSettings);
      setSettings(finalSettings);
    } else {
      finalSettings = {
        company_name: "Vylex",
        company_address: "Durban, South Africa",
        contact_name: "Avuyile Mthembu",
        phone: "+27 64 878 4287",
        email: "info@vylex.co.za",
        website: "vylex.co.za",
        bank_name: "Standard Bank",
        account_name: "Vylex",
        account_number: "1017 126 3314",
        branch_code: "7654",
        payshap_id: "064 878 4287",
        accent_color: "#051b38",
        currency: "R"
      };
      setSettings(finalSettings);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        // Query from DB (check both primary UUID id or invoice_number slug)
        const { data: invData, error: iErr } = await supabase
          .from("invoices")
          .select("*")
          .or(`id.eq.${invoiceIdOrNum},invoice_number.eq.${invoiceIdOrNum}`)
          .single();

        if (invData) {
          setInvoice(invData);
          
          // Load related client
          const { data: clientData } = await supabase
            .from("clients")
            .select("*")
            .eq("id", invData.client_id)
            .single();
          
          if (clientData) setClient(clientData);
        }
      } catch (err) {
        console.error("DB invoice fetch failed", err);
      }
    } else {
      // Local fallback
      const localInvoices = localStorage.getItem("vylex_ops_invoices");
      const localClients = localStorage.getItem("vylex_ops_clients");

      if (localInvoices && localClients) {
        const invoicesArr: Invoice[] = JSON.parse(localInvoices);
        const clientsArr: Client[] = JSON.parse(localClients);

        // Find matching invoice
        const foundInv = invoicesArr.find(
          inv => inv.id === invoiceIdOrNum || 
                 inv.invoice_number.replace(/[^a-zA-Z0-9]/g, "") === invoiceIdOrNum.replace(/[^a-zA-Z0-9]/g, "") ||
                 inv.invoice_number === invoiceIdOrNum ||
                 (inv.quote_id && inv.quote_id === invoiceIdOrNum)
        );

        if (foundInv) {
          setInvoice(foundInv);
          const foundClient = clientsArr.find(c => c.id === foundInv.client_id);
          if (foundClient) setClient(foundClient);
        }
      }
    }
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Simulate Instant EFT Payment Action
  const handleSimulatePayment = async () => {
    if (!invoice) return;
    setSubmitting(true);
    const todayStr = "2026-07-15";

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("invoices")
          .update({ status: "paid", paid_at: todayStr })
          .eq("id", invoice.id);
        
        showToast("💰 Payment received! Invoice status updated to PAID.");
        loadInvoiceData();
      } catch (err) {
        showToast("❌ Server DB update failed.");
        console.error(err);
      }
    } else {
      // Local updates
      const localInvoices = localStorage.getItem("vylex_ops_invoices");
      if (localInvoices) {
        const invoicesArr: Invoice[] = JSON.parse(localInvoices);
        const updated = invoicesArr.map(inv => {
          if (inv.id === invoice.id) {
            return { ...inv, status: "paid" as const, paid_at: todayStr };
          }
          return inv;
        });
        localStorage.setItem("vylex_ops_invoices", JSON.stringify(updated));
        showToast("💰 Payment received! (Local storage updated).");
        loadInvoiceData();
      }
    }
    setSubmitting(false);
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIdx = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${day} ${months[monthIdx]} ${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-500">
        <div className="text-center space-y-2">
          <i className="fa-solid fa-spinner animate-spin text-2xl text-sky-600"></i>
          <p className="text-xs font-bold uppercase tracking-wider">Loading client portal...</p>
        </div>
      </div>
    );
  }

  if (!invoice || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-500">
        <div className="text-center space-y-4 max-w-sm p-6 bg-white border border-slate-200 rounded-2xl">
          <i className="fa-solid fa-circle-exclamation text-3xl text-rose-500"></i>
          <h3 className="text-lg font-bold text-slate-900">Invoice Not Found</h3>
          <p className="text-xs font-medium">The invoice portal link does not exist or may have been canceled.</p>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === "paid";
  const currency = settings.currency;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-700">
      
      {/* Toast alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 border border-slate-800 text-amber-400 font-semibold text-xs p-4 rounded-xl shadow-2xl flex items-center gap-2">
          <i className="fa-solid fa-circle-info text-amber-400"></i>
          <span>{toast}</span>
        </div>
      )}

      {/* Main layout container */}
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div>
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Client Workspace Portal</h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">Tax Invoice details and banking transfers</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
          >
            <i className="fa-solid fa-print"></i> Print Invoice
          </button>
        </div>

        {/* Layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Invoice template A4 card */}
          <div className="lg:col-span-8">
            <div 
              className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 md:p-12 relative print:border-0 print:shadow-none"
              style={{ borderTop: `8px solid ${settings.accent_color}` }}
            >
              
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{settings.company_name}</h2>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-xs">{settings.company_address}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-black tracking-tight text-slate-900">TAX INVOICE</h3>
                  <span className="font-mono text-xs font-bold text-slate-400">{invoice.invoice_number}</span>
                  <span className={`block mt-2 font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded w-fit ml-auto ${
                    isPaid ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {isPaid ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-8 mt-12 border-t border-slate-100 pt-8">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Billed To:</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{client ? client.name : "Client"}</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{client ? client.address : ""}</p>
                  <p className="text-slate-500 text-[11px] mt-2 font-medium">Attn: {client ? client.contact_name : ""}</p>
                </div>
                <div className="text-right space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date Issued:</span>
                    <span className="font-bold font-mono text-slate-700">{formatDateLabel(invoice.issued_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Due:</span>
                    <span className="font-bold font-mono text-slate-700">{formatDateLabel(invoice.due_at)}</span>
                  </div>
                  {isPaid && invoice.paid_at && (
                    <div className="flex justify-between border-t border-emerald-100 pt-1 text-emerald-700">
                      <span>Date Settled:</span>
                      <span className="font-bold font-mono">{formatDateLabel(invoice.paid_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full text-left mt-10 text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider pb-2">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center w-12">Qty</th>
                    <th className="py-2 text-right w-24">Rate</th>
                    <th className="py-2 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.line_items.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-4">
                        <span className="font-bold text-slate-900 text-sm">{row.description}</span>
                        {row.details && row.details.length > 0 && (
                          <ul className="mt-1.5 space-y-1 list-disc pl-4 text-slate-500 text-[11px] font-medium">
                            {row.details.map((d, dIdx) => <li key={dIdx}>{d}</li>)}
                          </ul>
                        )}
                      </td>
                      <td className="py-4 text-center font-mono text-slate-600">{row.qty}</td>
                      <td className="py-4 text-right font-mono text-slate-600">{currency} {row.rate.toFixed(2)}</td>
                      <td className="py-4 text-right font-mono font-bold text-slate-900">{currency} {(row.qty * row.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mt-8 border-t border-slate-100 pt-6">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-slate-700">{currency} {invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>VAT (VAT Exempt):</span>
                    <span className="font-mono font-bold text-slate-400">R 0.00</span>
                  </div>
                  <div 
                    className="flex justify-between border-t pt-2 text-sm text-slate-900 font-extrabold mt-2"
                    style={{ borderTop: `1px solid ${settings.accent_color}` }}
                  >
                    <span>Total Amount Due:</span>
                    <span className="font-mono text-base">{currency} {invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Bank instructions box */}
              <div className="mt-10 bg-slate-50 border border-slate-100 rounded-xl p-6 space-y-3 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  EFT BANKING INSTRUCTIONS
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-medium text-slate-500">
                  <div>Bank Name: <span className="font-bold text-slate-700">{settings.bank_name}</span></div>
                  <div>Account Holder: <span className="font-bold text-slate-700">{settings.account_name}</span></div>
                  <div>Account Number: <span className="font-bold text-slate-700 font-mono">{settings.account_number}</span></div>
                  <div>Branch Code: <span className="font-bold text-slate-700 font-mono">{settings.branch_code}</span></div>
                  <div className="col-span-2 mt-2 pt-2 border-t border-slate-200/60">
                    PayShap Cell / ID: <span className="font-bold text-slate-700 font-mono">{settings.payshap_id}</span>
                  </div>
                </div>
                {!isPaid && (
                  <p className="text-[10px] text-amber-600 font-bold bg-amber-50 border border-amber-100 p-2.5 rounded-lg mt-3 flex items-center gap-1.5">
                    <i className="fa-solid fa-circle-exclamation text-xs"></i>
                    Please use reference {invoice.invoice_number} and email confirmation to {settings.email} once settled.
                  </p>
                )}
              </div>

              <p className="text-[10px] text-center text-slate-400 mt-12 font-medium tracking-wide">
                Thank you for your business. For any invoice queries, contact {settings.email}.
              </p>

            </div>
          </div>

          {/* Right Column: EFT Check Sandbox simulator */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            
            {!isPaid ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-slate-900">EFT Settlement</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Transfer funds using the bank instructions. You can simulate the instant bank EFT notification to reconcile the invoice status.
                </p>
                <button 
                  onClick={handleSimulatePayment}
                  disabled={submitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 shadow"
                >
                  {submitting ? <i className="fa-solid fa-circle-notch animate-spin text-xs"></i> : null}
                  <span>Simulate Instant EFT Payment</span>
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl shadow-sm">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h3 className="font-bold text-slate-900">Invoice Reconciled</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  This transaction is fully settled and verified on standard bank feeds. No action required.
                </p>
              </div>
            )}

            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 text-xs text-slate-400 space-y-2 font-medium">
              <span className="font-bold text-slate-700 block">Support Desk</span>
              <p>For any queries relating to this invoice, reach out to standard contacts:</p>
              <div>Email: <a href={`mailto:${settings.email}`} className="text-sky-600 hover:underline font-bold">{settings.email}</a></div>
              <div>Phone: <span className="font-bold text-slate-700">{settings.phone}</span></div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
