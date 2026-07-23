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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
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
          setErrorMsg(error.message);
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

        setSession({
          name: companyName,
          email,
          loggedInAt: new Date().toISOString(),
        });

        router.push("/");
        return;
      } catch (err: any) {
        console.error("Supabase registration error:", err);
      }
    }

    // Local Storage Fallback
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
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 md:p-10 rounded-2xl shadow-lg space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-900">
            VYLEX<span className="text-brand-accent">OPS</span>
          </Link>
          <h2 className="text-sm font-bold uppercase tracking-wider mt-4 text-slate-900">Register Account</h2>
          <p className="text-slate-500 text-xs mt-1">Start running your B2B billing workflow.</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium p-3.5 rounded-xl flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation" />
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
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ops-btn-primary w-full !py-3"
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
