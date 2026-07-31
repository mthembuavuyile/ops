"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Parse the URL hash when component mounts to check if we have an access_token.
  // Supabase handles the session internally if the token is in the hash,
  // but it's good to ensure it's there before allowing a reset.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash && !window.location.search.includes('code=')) {
      // In some configurations, Supabase redirects to a generic error page, or we just warn them
      // we'll let the user attempt to type it anyway, but normally we'd hide the form if no token.
    }
  }, []);

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isPasswordStrong = Object.values(checks).every(Boolean);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!isPasswordStrong) {
      setMessage({ type: "error", text: "Please ensure your password meets all requirements." });
      setLoading(false);
      return;
    }

    const hasSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

    if (hasSupabaseKey) {
      try {
        const { supabase } = await import("@/lib/supabase");
        // Update user will use the active session (established from the URL hash by Supabase)
        const { error } = await supabase.auth.updateUser({
          password: password,
        });

        if (error) {
          console.error("Supabase update password error:", error);
          setMessage({
            type: "error",
            text: "Failed to reset password. The link may have expired or is invalid.",
          });
        } else {
          setMessage({
            type: "success",
            text: "Password updated successfully! Redirecting to login...",
          });
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (err: any) {
        console.error("Supabase update error:", err);
        setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
      }
    } else {
      // Demo mode fallback
      setTimeout(() => {
        setMessage({
          type: "success",
          text: "Demo Mode: Password would be updated here. Redirecting...",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }, 600);
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
          <h2 className="text-sm font-bold uppercase tracking-wider mt-4 text-slate-900">Set New Password</h2>
          <p className="text-slate-500 text-xs mt-1">Enter a strong new password for your account.</p>
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

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div className="space-y-1.5">
            <label className="ops-label">New Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                <i className="fa-solid fa-lock" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ops-input !pl-9"
                required
                disabled={loading || message?.type === "success"}
              />
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="mt-3 space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Password requirements:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 ${checks.length ? 'text-emerald-600' : 'text-slate-500'}`}>
                    <i className={`fa-solid ${checks.length ? 'fa-check' : 'fa-circle'} ${checks.length ? '' : 'text-[8px]'}`} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${checks.upper ? 'text-emerald-600' : 'text-slate-500'}`}>
                    <i className={`fa-solid ${checks.upper ? 'fa-check' : 'fa-circle'} ${checks.upper ? '' : 'text-[8px]'}`} />
                    <span>Uppercase</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${checks.lower ? 'text-emerald-600' : 'text-slate-500'}`}>
                    <i className={`fa-solid ${checks.lower ? 'fa-check' : 'fa-circle'} ${checks.lower ? '' : 'text-[8px]'}`} />
                    <span>Lowercase</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${checks.number ? 'text-emerald-600' : 'text-slate-500'}`}>
                    <i className={`fa-solid ${checks.number ? 'fa-check' : 'fa-circle'} ${checks.number ? '' : 'text-[8px]'}`} />
                    <span>Number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${checks.special ? 'text-emerald-600' : 'text-slate-500'}`}>
                    <i className={`fa-solid ${checks.special ? 'fa-check' : 'fa-circle'} ${checks.special ? '' : 'text-[8px]'}`} />
                    <span>Special character</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || message?.type === "success" || (password.length > 0 && !isPasswordStrong)}
            className="ops-btn-primary w-full !py-3 disabled:opacity-50"
          >
            {loading && <i className="fa-solid fa-spinner animate-spin" />}
            Update Password
          </button>
        </form>
      </div>
    </main>
  );
}
