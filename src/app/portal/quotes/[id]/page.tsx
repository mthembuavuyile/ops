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

interface Quote {
  id: string;
  client_id: string;
  quote_number: string;
  status: "draft" | "sent" | "accepted" | "declined";
  issued_at: string;
  expires_at: string;
  line_items: LineItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
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

export default function QuotePortal() {
  const params = useParams();
  const router = useRouter();
  const quoteIdOrNum = params.id as string;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  // Acceptance fields
  const [signedName, setSignedName] = useState("");
  const [signedCheckbox, setSignedCheckbox] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Notification toast
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadQuoteData();
  }, [quoteIdOrNum]);

  const loadQuoteData = async () => {
    setLoading(true);
    
    // 1. Fetch settings (either DB or local fallback)
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
        // Query from DB (check both primary UUID id or quote_number slug)
        const { data: quoteData, error: qErr } = await supabase
          .from("quotes")
          .select("*")
          .or(`id.eq.${quoteIdOrNum},quote_number.eq.${quoteIdOrNum}`)
          .single();

        if (quoteData) {
          setQuote(quoteData);
          
          // Load related client
          const { data: clientData } = await supabase
            .from("clients")
            .select("*")
            .eq("id", quoteData.client_id)
            .single();
          
          if (clientData) setClient(clientData);
        }
      } catch (err) {
        console.error("DB quote fetch failed", err);
      }
    } else {
      // Local fallback
      const localQuotes = localStorage.getItem("vylex_ops_quotes");
      const localClients = localStorage.getItem("vylex_ops_clients");

      if (localQuotes && localClients) {
        const quotesArr: Quote[] = JSON.parse(localQuotes);
        const clientsArr: Client[] = JSON.parse(localClients);

        // Find by id, quote_number, or simple slug (index fallback e.g. Q-2026-001)
        const foundQuote = quotesArr.find(
          q => q.id === quoteIdOrNum || 
               q.quote_number.replace(/[^a-zA-Z0-9]/g, "") === quoteIdOrNum.replace(/[^a-zA-Z0-9]/g, "") ||
               q.quote_number === quoteIdOrNum
        );

        if (foundQuote) {
          setQuote(foundQuote);
          const foundClient = clientsArr.find(c => c.id === foundQuote.client_id);
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

  const handleAcceptProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signedCheckbox || !signedName.trim()) {
      showToast("⚠️ Complete signature and check terms to approve.");
      return;
    }
    if (!quote) return;

    setSubmitting(true);
    const todayStr = "2026-07-15";

    if (isSupabaseConfigured && supabase) {
      try {
        // Update quote status to accepted
        await supabase
          .from("quotes")
          .update({ status: "accepted" })
          .eq("id", quote.id);

        // Create the invoice
        const clientPrefix = client ? client.prefix : "INV";
        const { count } = await supabase.from("invoices").select("*", { count: "exact" });
        const nextIndex = (count || 0) + 1;
        const invNum = `${clientPrefix}-2026-${String(nextIndex).padStart(3, "0")}`;

        const newInvoice = {
          client_id: quote.client_id,
          quote_id: quote.id,
          invoice_number: invNum,
          status: "unpaid",
          issued_at: todayStr,
          due_at: "2026-07-29",
          line_items: quote.line_items,
          subtotal: quote.subtotal,
          vat: quote.vat,
          total: quote.total,
          notes: `Digitally signed by ${signedName} on portal.`,
        };

        const { data: insertedInv } = await supabase
          .from("invoices")
          .insert(newInvoice)
          .select()
          .single();

        showToast("Proposal approved successfully! Redirecting...");
        if (insertedInv) {
          router.push(`/portal/invoices/${insertedInv.id}`);
        } else {
          loadQuoteData();
        }
      } catch (err) {
        showToast("❌ Server database write failed.");
        console.error(err);
      }
    } else {
      // LocalStorage update
      const localQuotes = localStorage.getItem("vylex_ops_quotes");
      const localInvoices = localStorage.getItem("vylex_ops_invoices");

      if (localQuotes && localInvoices) {
        const quotesArr: Quote[] = JSON.parse(localQuotes);
        const invoicesArr: Invoice[] = JSON.parse(localInvoices);

        const updatedQuotes = quotesArr.map(q => {
          if (q.id === quote.id) {
            return { ...q, status: "accepted" as const };
          }
          return q;
        });

        const clientPrefix = client ? client.prefix : "INV";
        const nextIndex = invoicesArr.length + 1;
        const invNum = `${clientPrefix}-2026-${String(nextIndex).padStart(3, "0")}`;
        const newInvId = `inv-${Date.now()}`;

        const newInvoice: Invoice = {
          id: newInvId,
          client_id: quote.client_id,
          quote_id: quote.id,
          invoice_number: invNum,
          status: "unpaid",
          issued_at: todayStr,
          due_at: "2026-07-29",
          line_items: quote.line_items,
          subtotal: quote.subtotal,
          vat: quote.vat,
          total: quote.total,
          notes: `Digitally signed by ${signedName} on portal.`,
          paid_at: null
        };

        const updatedInvoices = [...invoicesArr, newInvoice];
        localStorage.setItem("vylex_ops_quotes", JSON.stringify(updatedQuotes));
        localStorage.setItem("vylex_ops_invoices", JSON.stringify(updatedInvoices));

        showToast("Proposal approved successfully! Loading invoice...");
        setTimeout(() => {
          router.push(`/portal/invoices/${newInvId}`);
        }, 1200);
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

  if (!quote || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-500">
        <div className="text-center space-y-4 max-w-sm p-6 bg-white border border-slate-200 rounded-2xl">
          <i className="fa-solid fa-circle-exclamation text-3xl text-rose-500"></i>
          <h3 className="text-lg font-bold text-slate-900">Document Not Found</h3>
          <p className="text-xs font-medium">The quote link you opened does not exist or may have expired.</p>
        </div>
      </div>
    );
  }

  const isAccepted = quote.status === "accepted";
  const currency = settings.currency;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-700">
      
      {/* Toast Alert */}
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
            <p className="text-xs font-semibold text-slate-500 mt-1">Secure proposal workspace provided by {settings.company_name}</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
          >
            <i className="fa-solid fa-print"></i> Print Proposal
          </button>
        </div>

        {/* Dynamic layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quote template card */}
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
                  <h3 className="text-lg font-black tracking-tight text-slate-900">PROPOSAL & QUOTE</h3>
                  <span className="font-mono text-xs font-bold text-slate-400">{quote.quote_number}</span>
                  <span className={`block mt-2 font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded w-fit ml-auto ${
                    isAccepted ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-sky-50 text-sky-700 border border-sky-100"
                  }`}>
                    {quote.status}
                  </span>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-8 mt-12 border-t border-slate-100 pt-8">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Prepared For:</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{client ? client.name : "Client"}</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{client ? client.address : ""}</p>
                  <p className="text-slate-500 text-[11px] mt-2 font-medium">Attn: {client ? client.contact_name : ""}</p>
                </div>
                <div className="text-right space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date Issued:</span>
                    <span className="font-bold font-mono text-slate-700">{formatDateLabel(quote.issued_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Proposal Valid Until:</span>
                    <span className="font-bold font-mono text-slate-700">{formatDateLabel(quote.expires_at)}</span>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full text-left mt-10 text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider pb-2">
                    <th className="py-2">Scope of Services</th>
                    <th className="py-2 text-center w-12">Qty</th>
                    <th className="py-2 text-right w-24">Rate</th>
                    <th className="py-2 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quote.line_items.map((row, idx) => (
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
                    <span className="font-mono font-bold text-slate-700">{currency} {quote.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>VAT (VAT Exempt):</span>
                    <span className="font-mono font-bold text-slate-400">R 0.00</span>
                  </div>
                  <div 
                    className="flex justify-between border-t pt-2 text-sm text-slate-900 font-extrabold mt-2"
                    style={{ borderTop: `1px solid ${settings.accent_color}` }}
                  >
                    <span>Proposal Value:</span>
                    <span className="font-mono text-base">{currency} {quote.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {quote.notes && (
                <div className="mt-8 bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs leading-relaxed text-slate-500 font-medium">
                  <span className="font-bold text-slate-700 block mb-1">Proposal Terms & Notes:</span>
                  {quote.notes}
                </div>
              )}

              <p className="text-[10px] text-center text-slate-400 mt-12 font-medium tracking-wide">
                Powered by Vylex Operations Dashboard. Reference ID: {quote.id.slice(0, 8)}
              </p>

            </div>
          </div>

          {/* Right Column: Interaction Form */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            {!isAccepted ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-slate-900">Approve Proposal</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Review all services listed. Signing acceptance converts this quote to an unpaid invoice in our operations portal.
                </p>
                
                <form onSubmit={handleAcceptProposal} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Authorized Signature Name</label>
                    <input 
                      type="text" 
                      placeholder="Type full legal name..."
                      value={signedName}
                      onChange={(e) => setSignedName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      required
                    />
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-500 select-none cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={signedCheckbox}
                      onChange={(e) => setSignedCheckbox(e.target.checked)}
                      className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                      required
                    />
                    <span className="font-medium leading-normal">
                      I accept the services scope and billing terms of {settings.company_name}.
                    </span>
                  </label>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow transition"
                  >
                    {submitting ? <i className="fa-solid fa-circle-notch animate-spin mr-1"></i> : null}
                    Confirm Acceptance
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl shadow-sm">
                  <i className="fa-solid fa-circle-check animate-bounce"></i>
                </div>
                <h3 className="font-bold text-slate-900">Proposal Approved</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  This proposal was accepted and signed. We have compiled your billing invoice.
                </p>
                <button 
                  onClick={() => {
                    // Redirect to invoice lookup (using same ID schema)
                    router.push(`/portal/invoices/${quoteIdOrNum}`);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs py-2.5 rounded-lg transition"
                >
                  View Invoice & Payment Details
                </button>
              </div>
            )}

            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 text-xs text-slate-400 space-y-2 font-medium">
              <span className="font-bold text-slate-700 block">Support Desk</span>
              <p>For any queries relating to this proposal, reach out to standard contacts:</p>
              <div>Email: <a href={`mailto:${settings.email}`} className="text-sky-600 hover:underline font-bold">{settings.email}</a></div>
              <div>Phone: <span className="font-bold text-slate-700">{settings.phone}</span></div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
