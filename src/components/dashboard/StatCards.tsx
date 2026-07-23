"use client";

import React from "react";
import type { Invoice, Quote } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";

interface StatCardsProps {
  invoices: Invoice[];
  quotes: Quote[];
  currency: string;
  onNewQuote: () => void;
}

export default function StatCards({ invoices, quotes, currency, onNewQuote }: StatCardsProps) {
  const today = new Date().toISOString().split("T")[0];

  let pendingTotal = 0, pendingCount = 0;
  let overdueTotal = 0, overdueCount = 0;
  let collectedTotal = 0, collectedCount = 0;
  let activeQuotes = 0;

  invoices.forEach((inv) => {
    if (inv.status === "paid") { collectedTotal += inv.total; collectedCount++; }
    else if (inv.status === "unpaid") {
      pendingTotal += inv.total; pendingCount++;
      if (inv.due_at < today) { overdueTotal += inv.total; overdueCount++; }
    }
  });

  quotes.forEach((q) => { if (q.status === "sent") activeQuotes++; });

  const cards = [
    { label: "Pending Invoices", value: formatCurrency(pendingTotal, currency), sub: `${pendingCount} unpaid invoices`, color: "text-amber-600" },
    { label: "Overdue Cash", value: formatCurrency(overdueTotal, currency), sub: `${overdueCount} invoices past due`, color: "text-rose-500" },
    { label: "Collected (MTD)", value: formatCurrency(collectedTotal, currency), sub: `${collectedCount} paid this month`, color: "text-emerald-600" },
    { label: "Active Quotes", value: String(activeQuotes), sub: "Awaiting client acceptance", color: "text-brand-accent" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time status of your active pipelines.</p>
        </div>
        <button onClick={onNewQuote} className="ops-btn-primary">
          <i className="fa-solid fa-plus" /> New Quote
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="ops-stat-card">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{card.label}</span>
            <div className={`text-2xl font-extrabold mt-1 ${card.color}`}>{card.value}</div>
            <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
