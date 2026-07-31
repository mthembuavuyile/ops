"use client";

import React from "react";
import Link from "next/link";
import type { AppView, UserSession } from "@/lib/types";

interface SidebarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onReset: () => void;
  companyName: string;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
  session: UserSession | null;
  onLogout: () => void;
  onSync?: () => void;
}

interface NavItem {
  id: AppView;
  label: string;
  icon: string;
}

const MAIN_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "fa-chart-line" },
  { id: "clients", label: "Clients", icon: "fa-users" },
  { id: "builder", label: "Create a Quote", icon: "fa-file-signature" },
  { id: "invoice-maker", label: "Invoice Maker", icon: "fa-file-invoice" },
  { id: "billing", label: "Quotes & Invoices", icon: "fa-file-invoice-dollar" },
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
  session,
  onLogout,
  onSync,
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
        className={`ops-sidebar ${sidebarOpen ? "open" : ""} md:!left-0 md:!relative flex flex-col`}
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

        {/* Account status card */}
        <div className="mx-4 mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          {session ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 truncate max-w-[130px]">
                  {session.name}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <i className="fa-solid fa-cloud text-[9px]" /> CLOUD
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{session.email}</p>
              {onSync && (
                <button
                  onClick={onSync}
                  className="w-full mt-1.5 flex items-center justify-center gap-1.5 py-1 px-2 text-[10px] font-bold text-brand-accent bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                >
                  <i className="fa-solid fa-rotate text-[9px]" /> Sync Cloud Data
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-700 font-semibold text-[11px]">
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-user-clock text-amber-500" /> Guest Mode
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Local Storage</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <Link
                  href="/login"
                  className="flex-1 text-center py-1 px-2 text-[10px] font-bold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-1 px-2 text-[10px] font-bold text-white bg-brand-accent rounded hover:bg-blue-950 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
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
          <Link
            href="/landing"
            className="ops-nav-btn hover:text-slate-900"
          >
            <i className="fa-solid fa-globe text-slate-400" />
            <span>Landing Page</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          {session ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 hover:text-rose-600 font-medium transition-colors"
              title="Sign out of account"
            >
              <i className="fa-solid fa-right-from-bracket text-rose-500" />
              <span>Log Out</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-circle-user text-slate-400" />
              <span className="font-medium text-slate-600">Guest User</span>
            </div>
          )}
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
