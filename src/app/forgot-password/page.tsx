"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const hasSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

    if (hasSupabaseKey) {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
          // Even if email is not found, returning success prevents user enumeration.
          console.error("Supabase reset password error:", error);
          setMessage({
            type: "success",
            text: "If an account exists with this email, a password reset link has been sent.",
          });
        } else {
          setMessage({
            type: "success",
            text: "If an account exists with this email, a password reset link has been sent.",
          });
        }
      } catch (err: unknown) {
        console.error("Supabase reset error:", err);
        setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
      }
    } else {
      // Local Storage Fallback (Demo Mode)
      setTimeout(() => {
        setMessage({
          type: "success",
          text: "Demo mode: If this were connected to Supabase, an email would have been sent.",
        });
        setLoading(false);
      }, 600);
      return;
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 md:p-10 rounded-2xl shadow-lg space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-900">
            VYLEX<span className="text-brand-accent">OPS</span>
          </Link>
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

        <div className="text-center text-xs font-medium text-slate-500 pt-2 border-t border-slate-200">
          Remember your password?{" "}
          <Link href="/login" className="text-brand-accent hover:underline font-bold">
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
