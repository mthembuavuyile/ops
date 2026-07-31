"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setSession } from "@/lib/data";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Exponential backoff state
  const [attemptCount, setAttemptCount] = useState(0);
  const [backoffTime, setBackoffTime] = useState(0);

  // Clear backoff when time expires
  useEffect(() => {
    if (backoffTime > 0) {
      const timer = setInterval(() => {
        if (Date.now() > backoffTime) {
          setBackoffTime(0);
          setErrorMsg(null);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [backoffTime]);

  const handleGoogleLogin = async () => {
    const hasSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";
    if (!hasSupabaseKey) {
      setErrorMsg("Google Sign-In requires Supabase configuration.");
      return;
    }
    
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google login error:", err);
      setErrorMsg("Failed to initialize Google Sign-In.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (backoffTime > Date.now()) {
      const waitSecs = Math.ceil((backoffTime - Date.now()) / 1000);
      setErrorMsg(`Too many attempts. Please wait ${waitSecs} seconds.`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const hasSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

    if (hasSupabaseKey) {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          const newAttemptCount = attemptCount + 1;
          setAttemptCount(newAttemptCount);
          
          if (newAttemptCount >= 3) {
            const backoffMs = Math.pow(2, newAttemptCount) * 1000; // 8s, 16s, 32s...
            setBackoffTime(Date.now() + backoffMs);
            setErrorMsg(`Invalid credentials. Please wait ${Math.ceil(backoffMs/1000)} seconds before trying again.`);
          } else {
            setErrorMsg("Invalid email or password.");
          }
          setLoading(false);
          return;
        }

        if (data.session) {
          // Reset attempts on successful login
          setAttemptCount(0);
          setBackoffTime(0);
          
          setSession({
            name: data.user.email?.split("@")[0] || email.split("@")[0],
            email: data.user.email || email,
            loggedInAt: new Date().toISOString(),
          });
          router.push("/");
          return;
        }
      } catch (err: any) {
        console.error("Supabase login error:", err);
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } else {
      // Local Storage Fallback (Demo Mode)
      setTimeout(() => {
        if (email.includes("@") && password.length >= 4) {
          setSession({
            name: email.split("@")[0],
            email,
            loggedInAt: new Date().toISOString(),
          });
          router.push("/");
        } else {
          setErrorMsg("Invalid email or password.");
        }
        setLoading(false);
      }, 400);
    }
  };

  const isLockedOut = backoffTime > Date.now();

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 md:p-10 rounded-2xl shadow-lg space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-900">
            VYLEX<span className="text-brand-accent">OPS</span>
          </Link>
          <h2 className="text-sm font-bold uppercase tracking-wider mt-4 text-slate-900">Login</h2>
          <p className="text-slate-500 text-xs mt-1">Access your billing workspace.</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium p-3.5 rounded-xl flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
                disabled={isLockedOut || loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="ops-label">Password</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-brand-accent hover:underline">
                Forgot password?
              </Link>
            </div>
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
                disabled={isLockedOut || loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLockedOut || loading}
            className="ops-btn-primary w-full !py-3 disabled:opacity-50"
          >
            {loading && <i className="fa-solid fa-spinner animate-spin" />}
            {isLockedOut ? `Wait ${Math.ceil((backoffTime - Date.now()) / 1000)}s` : "Sign In"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium py-2.5 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        <div className="text-center text-xs font-medium text-slate-500 pt-2 border-t border-slate-200">
          New here?{" "}
          <Link href="/register" className="text-brand-accent hover:underline font-bold">
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
