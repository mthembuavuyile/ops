"use client";

import React from "react";
import type { Client } from "@/lib/types";

interface ClientListProps {
  clients: Client[];
}

export default function ClientList({ clients }: ClientListProps) {
  return (
    <div className="ops-card">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-lg">Active Clients</h3>
        <p className="text-slate-400 text-xs mt-1">Configured billing prefixes.</p>
      </div>
      <div className="p-6 divide-y divide-slate-100">
        {clients.length === 0 ? (
          <div className="text-center text-slate-400 py-6 text-sm">
            No active clients. Add your first client to get started.
          </div>
        ) : (
          clients.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-3">
              <div>
                <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{c.email}</span>
              </div>
              <span className="text-xs bg-amber-50 text-amber-700 font-mono font-bold px-2 py-0.5 rounded border border-amber-200/60">
                {c.prefix}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
