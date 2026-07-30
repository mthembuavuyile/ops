"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const DISMISS_KEY = "vylex_ops_guest_banner_dismissed";

export default function GuestBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDismissed = localStorage.getItem(DISMISS_KEY) === "true";
      setDismissed(isDismissed);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISS_KEY, "true");
    }
  };

  if (dismissed) {
    return (
      <div className="mb-6 flex items-center justify-between bg-amber-50/80 border border-amber-200/80 rounded-xl px-4 py-2.5 text-xs text-amber-900 shadow-sm">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-circle-info text-amber-600" />
          <span>
            <strong className="font-semibold">Guest Mode:</strong> Data saved in browser local storage.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="font-bold text-brand-accent hover:underline flex items-center gap-1"
          >
            <i className="fa-solid fa-shield-halved text-[10px]" /> Enable Cloud Backup & Account Perks
          </Link>
          <button
            onClick={() => setDismissed(false)}
            className="text-amber-700 hover:text-amber-900 font-semibold underline ml-2"
          >
            Why sign up?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden border border-blue-900/50">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full">
              Free Account Benefits
            </span>
            <span className="text-slate-400 text-xs font-medium">Guest mode data is preserved on sign-up</span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white transition-colors p-1"
            title="Dismiss banner"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Unlock Full Business Capabilities with a Free Account
          </h2>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-3xl">
            Enjoy full guest access anytime, or upgrade for free to protect your data, auto-fill client records, and display verified business seals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
            <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
              <i className="fa-solid fa-cloud-arrow-up text-sm" /> Cloud Backup & Restore
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              Sync your invoices, quotes & client list across all devices safely.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
            <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
              <i className="fa-solid fa-badge-check text-sm" /> Verified Pro Badge
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              Add an official verification seal to PDF invoices to boost client trust.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
            <div className="text-blue-400 font-bold text-xs flex items-center gap-1.5">
              <i className="fa-solid fa-bolt text-sm" /> PayShap Instant Settlement
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              Auto-fill banking & PayShap details for faster local client payments.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
            <div className="text-purple-400 font-bold text-xs flex items-center gap-1.5">
              <i className="fa-solid fa-box-archive text-sm" /> JSON Data Export
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              Export and import full backup files anytime for total data privacy.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="bg-brand-accent hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <i className="fa-solid fa-user-plus" /> Create Free Account
            </Link>
            <Link
              href="/login"
              className="bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all border border-white/10"
            >
              Log In
            </Link>
          </div>
          <button
            onClick={handleDismiss}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Continue as Guest <i className="fa-solid fa-arrow-right text-[10px] ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
