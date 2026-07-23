"use client";

import React from "react";
import type { AppView } from "@/lib/types";

interface SidebarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onReset: () => void;
  companyName: string;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
}

interface NavItem {
  id: AppView;
  label: string;
  icon: string;
}

const MAIN_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "fa-chart-line" },
  { id: "clients", label: "Clients", icon: "fa-users" },
  { id: "billing", label: "Quotes & Invoices", icon: "fa-file-invoice-dollar" },
  { id: "builder", label: "Create a Quote", icon: "fa-file-signature" },
  { id: "invoice-maker", label: "Invoice Maker", icon: "fa-file-invoice" },
  { id: "reminders", label: "Payment Reminders", icon: "fa-clock" },
  { id: "history", label: "History & Credits", icon: "fa-box-archive" },
];

const SYSTEM_NAV: NavItem[] = [
  { id: "settings", label: "Settings", icon: "fa-gears" },
];

const SANDBOX_NAV: NavItem[] = [
  { id: "client-portal", label: "Client Portal Link", icon: "fa-link" },
];

export default function Sidebar({
  activeView,
  onNavigate,
  onReset,
  companyName,
  sidebarOpen,
  onCloseSidebar,
}: SidebarProps) {
  const handleNav = (view: AppView) => {
    onNavigate(view);
    onCloseSidebar();
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onCloseSidebar}
        />
      )}

      <aside
        className={`ops-sidebar ${sidebarOpen ? "open" : ""} md:!left-0 md:!relative`}
      >
        {/* Brand */}
        <div className="p-6 flex items-center justify-between border-b border-slate-200">
          <button
            onClick={() => handleNav("dashboard")}
            className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-slate-900"
          >
            {(companyName || "VYLEX").toUpperCase()}
            <span className="text-brand-accent">OPS</span>
          </button>
          <span className="bg-brand-accentLight text-brand-accent border border-blue-200 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded">
            v2.0
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-widest px-3 mb-2">
            Workspace
          </div>
          {MAIN_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`ops-nav-btn ${activeView === item.id ? "active" : ""}`}
            >
              <i className={`fa-solid ${item.icon}`} />
              <span>{item.label}</span>
            </button>
          ))}

          <div className="pt-5 text-slate-400 text-[10px] uppercase font-bold tracking-widest px-3 mb-2">
            Simulation
          </div>
          {SANDBOX_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`ops-nav-btn ${activeView === item.id ? "active" : ""}`}
            >
              <i className={`fa-solid ${item.icon}`} />
              <span>{item.label}</span>
            </button>
          ))}

          <div className="pt-5 text-slate-400 text-[10px] uppercase font-bold tracking-widest px-3 mb-2">
            System
          </div>
          {SYSTEM_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`ops-nav-btn ${activeView === item.id ? "active" : ""}`}
            >
              <i className={`fa-solid ${item.icon}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-user text-emerald-500" />
            <span className="font-medium">Guest User</span>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1 hover:text-amber-600 transition-colors"
            title="Reset all data to defaults"
          >
            <i className="fa-solid fa-rotate-left" />
            Reset
          </button>
        </div>
      </aside>
    </>
  );
}
