"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setSession, saveSettings, getSettings } from "@/lib/data";
import type { Settings } from "@/lib/types";

export default function Register() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isPasswordStrong = Object.values(checks).every(Boolean);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!isPasswordStrong) {
      setErrorMsg("Please ensure your password meets all requirements.");
      setLoading(false);
      return;
    }

    const hasSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

    if (hasSupabaseKey) {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              company_name: companyName,
            },
          },
        });

        if (error) {
          setErrorMsg("Registration failed. Email may already be in use or invalid.");
          setLoading(false);
          return;
        }
        
        if (data?.user?.identities?.length === 0) {
          // Supabase trick: if identities is empty, the user already existed
          setErrorMsg("Registration failed. Email may already be in use.");
          setLoading(false);
          return;
        }

        const currentSettings = getSettings();
        saveSettings({
          ...currentSettings,
          company_name: companyName,
          email: email,
          contact_name: companyName,
        });

        // Depending on whether confirm email is on, session might be null.
        if (data.session) {
          setSession({
            name: companyName,
            email,
            loggedInAt: new Date().toISOString(),
          });
          router.push("/");
        } else {
          setErrorMsg("Success! Please check your email to confirm your account before logging in.");
          setLoading(false);
        }
        return;
      } catch (err: unknown) {
        console.error("Supabase registration error:", err);
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } else {
      // Local Storage Fallback (Demo Mode)
      setTimeout(() => {
        const currentSettings = getSettings();
        const newSettings: Settings = {
          ...currentSettings,
          company_name: companyName,
          email: email,
          contact_name: companyName,
        };
        saveSettings(newSettings);

        setSession({
          name: companyName,
          email,
          loggedInAt: new Date().toISOString(),
        });

        router.push("/");
        setLoading(false);
      }, 400);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 md:p-10 rounded-2xl shadow-lg space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-900">
            VYLEX<span className="text-brand-accent">OPS</span>
          </Link>
          <h2 className="text-sm font-bold uppercase tracking-wider mt-4 text-slate-900">Register Account</h2>
          <p className="text-slate-500 text-xs mt-1">Start running your B2B billing workflow.</p>
        </div>

        {errorMsg && (
          <div className={`border text-xs font-medium p-3.5 rounded-xl flex items-center gap-2 ${errorMsg.includes("Success") ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-600"}`}>
            <i className={`fa-solid ${errorMsg.includes("Success") ? "fa-check-circle" : "fa-circle-exclamation"}`} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="ops-label">Business / Company Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                <i className="fa-solid fa-building" />
              </span>
              <input
                type="text"
                placeholder="Vylex Technologies"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="ops-input !pl-9"
                required
                disabled={loading}
              />
            </div>
          </div>

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

          <div className="space-y-1.5">
            <label className="ops-label">Password</label>
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
                disabled={loading}
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
            disabled={loading || (password.length > 0 && !isPasswordStrong)}
            className="ops-btn-primary w-full !py-3 disabled:opacity-50"
          >
            {loading && <i className="fa-solid fa-spinner animate-spin" />}
            Sign Up
          </button>
        </form>


        <div className="text-center text-xs font-medium text-slate-500 pt-2 border-t border-slate-200">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-accent hover:underline font-bold">
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
