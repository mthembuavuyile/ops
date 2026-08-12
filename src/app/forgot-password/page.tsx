"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Reset password error:", error);
      }
      // Always show success to prevent user enumeration
      setMessage({
        type: "success",
        text: "If an account exists with this email, a password reset link has been sent.",
      });
    } catch (err: unknown) {
      console.error("Reset error:", err);
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 md:p-10 rounded-2xl shadow-lg space-y-8">
        <div className="text-center">
          <Logo href="/landing" mode="light" size="md" />
          <div className="text-[11px] font-semibold text-slate-400 tracking-wide mt-0.5">
            by{" "}
            <a
              href="https://vylex.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent hover:underline inline-flex items-center gap-1"
            >
              vylex.co.za
              <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
            </a>
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider mt-4 text-slate-900">Reset Password</h2>
          <p className="text-slate-500 text-xs mt-1">Enter your email to receive a reset link.</p>
        </div>

        {message && (
          <div
            className={`border text-xs font-medium p-3.5 rounded-xl flex items-start gap-2 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-600"
            }`}
          >
            <i
              className={`fa-solid mt-0.5 ${
                message.type === "success" ? "fa-check-circle" : "fa-circle-exclamation"
              }`}
            />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="space-y-1.5">
            <label className="ops-label">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                <i className="fa-solid fa-envelope" />
              </span>
              <input
                type="email"
                placeholder="you@company.co.za"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ops-input !pl-9"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ops-btn-primary w-full !py-3 disabled:opacity-50"
          >
            {loading && <i className="fa-solid fa-spinner animate-spin" />}
            Send Reset Link
          </button>
        </form>

        <div className="space-y-4 pt-4 border-t border-slate-200 text-center">
          <div className="text-xs font-medium text-slate-500">
            Remember your password?{" "}
            <Link href="/login" className="text-brand-accent hover:underline font-bold">
              Log in
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 text-xs font-medium text-slate-500 pt-3 border-t border-slate-100">
            <Link
              href="/landing"
              className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors text-slate-600"
            >
              <i className="fa-solid fa-house text-slate-400 text-xs" />
              <span>Landing Page</span>
            </Link>
            <span className="text-slate-300">•</span>
            <a
              href="https://vylex.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors text-slate-600"
            >
              <i className="fa-solid fa-globe text-slate-400 text-xs" />
              <span>vylex.co.za</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[9px] text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-3">
        <Link href="/landing" className="hover:text-slate-600 transition-colors">
          About Vylex Ops
        </Link>
        <span>•</span>
        <a
          href="https://vylex.co.za"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-600 transition-colors inline-flex items-center gap-1"
        >
          vylex.co.za
          <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
        </a>
      </footer>
    </main>
  );
}
