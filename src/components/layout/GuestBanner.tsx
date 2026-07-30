"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const DISMISS_KEY = "vylex_ops_guest_banner_dismissed";

export default function GuestBanner() {
  // Start as not-dismissed (show banner) until we check localStorage
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const wasDismissed = localStorage.getItem(DISMISS_KEY) === "true";
      setDismissed(wasDismissed);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISS_KEY, "true");
    }
  };

  // Don't render anything until mounted (avoid SSR mismatch)
  if (!mounted) return null;
  if (dismissed) return null;

  return (
    <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <i className="fa-solid fa-cloud-arrow-up text-brand-accent mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-slate-800">Guest Mode — Data stored in this browser only</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Sign up free to back up your data to the cloud and access it from any device.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/register"
          className="text-xs font-bold text-white bg-brand-accent hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          Sign Up Free
        </Link>
        <Link
          href="/login"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white"
        >
          Log In
        </Link>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          title="Dismiss"
          aria-label="Dismiss banner"
        >
          <i className="fa-solid fa-xmark text-sm" />
        </button>
      </div>
    </div>
  );
}
