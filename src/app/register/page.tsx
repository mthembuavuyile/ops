"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function Register() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              company_name: companyName,
            }
          }
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          showRegisterSuccess();
        }
      } catch (err) {
        setErrorMsg("Registation system failed.");
        console.error(err);
      }
    } else {
      // Mock Registration Mode
      setTimeout(() => {
        if (password.length < 6) {
          setErrorMsg("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }

        const mockSettings = {
          company_name: companyName,
          company_address: "Address, South Africa",
          contact_name: "Owner",
          phone: "+27 00 000 0000",
          email: email,
          website: "company.co.za",
          bank_name: "Standard Bank",
          account_name: companyName,
          account_number: "000000000",
          branch_code: "0000",
          payshap_id: "+27000000000",
          accent_color: "#051b38",
          currency: "R"
        };
        localStorage.setItem("vylex_ops_settings", JSON.stringify(mockSettings));
        localStorage.setItem("vylex_mock_session", JSON.stringify({ email }));
        router.push("/");
      }, 600);
      return;
    }

    setLoading(false);
  };

  const showRegisterSuccess = () => {
    alert("Sign up successful. Verify your email, then sign in.");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-ui-lightGray flex items-center justify-center p-4 relative font-sans text-slate-800">
      <div className="w-full max-w-md bg-white border border-ui-lightSlate p-8 md:p-10 rounded-none space-y-8">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold tracking-widest text-[#111111] uppercase block">
            VYLEX <span className="text-brand-orange">OPS</span>
          </Link>
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider mt-4 text-[#111111]">Register Account</h2>
          <p className="text-slate-500 text-xs mt-1">Start running your B2B billing and client workflow.</p>
        </div>

        {errorMsg && (
          <div className="bg-ui-white border border-ui-lightSlate text-ui-darkGray text-xs font-mono p-3.5 rounded-none flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">Business / Company Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                <i className="fa-solid fa-building"></i>
              </span>
              <input 
                type="text" 
                placeholder="Apex Technologies"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-white border border-ui-lightSlate rounded-none pl-9 pr-3 py-3 text-xs font-mono font-bold focus:outline-none focus:border-black text-slate-900"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input 
                type="email" 
                placeholder="owner@company.co.za"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-ui-lightSlate rounded-none pl-9 pr-3 py-3 text-xs font-mono font-bold focus:outline-none focus:border-black text-slate-900"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-ui-lightSlate rounded-none pl-9 pr-3 py-3 text-xs font-mono font-bold focus:outline-none focus:border-black text-slate-900"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#111111] hover:bg-[#252525] disabled:bg-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-none transition duration-150"
          >
            {loading ? <i className="fa-solid fa-spinner animate-spin mr-1.5"></i> : null}
            <span>Sign Up</span>
          </button>
        </form>

        <div className="text-center text-xs font-mono font-bold uppercase tracking-wider text-slate-500 pt-2 border-t border-[#EAE9E2]">
          <span>Already have an account? </span>
          <Link href="/login" className="text-brand-orange hover:underline">Log in</Link>
        </div>

      </div>
    </main>
  );
}
