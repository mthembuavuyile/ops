import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Vylex Ops (100% Free Billing Tool)",
  description: "Simple and transparent pricing. Vylex Ops is completely free to use with secure cloud account sync.",
  alternates: {
    canonical: "https://ops.vylex.co.za/pricing",
  },
  openGraph: {
    title: "Pricing — Vylex Ops (100% Free Billing Tool)",
    description: "Simple and transparent pricing. Vylex Ops is completely free to use with secure cloud account sync.",
    url: "https://ops.vylex.co.za/pricing",
    siteName: "Vylex Ops",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white flex flex-col justify-between">
      <div>
        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/landing" className="text-base font-extrabold tracking-tight text-slate-900 uppercase">
              VYLEX<span className="text-sky-600">OPS</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <Link href="/landing#features" className="hover:text-slate-900 transition-colors">Features</Link>
              <Link href="/pricing" className="text-slate-900 font-bold border-b-2 border-sky-600 pb-0.5">Pricing</Link>
              <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
              <Link href="/landing#faq" className="hover:text-slate-900 transition-colors">FAQ</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="border-b border-slate-200 bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-3">Transparent Pricing</h2>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              100% Free. No hidden fees or surprise subscriptions.
            </h1>
            <p className="mt-4 text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Vylex Ops is available for free to help small business owners and freelancers run their billing operations smoothly.
            </p>
          </div>
        </section>

        {/* PRICING CARD */}
        <section className="py-16 max-w-4xl mx-auto px-6">
          <div className="bg-white border-2 border-slate-900 rounded-xl p-8 max-w-xl mx-auto shadow-sm relative">
            <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Full Feature Access
            </div>

            <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">Free Operations Account</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-slate-900">R0</span>
              <span className="text-xs text-slate-500 font-medium">/ forever</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Create an account and immediately start managing quotes, invoices, and client portals across all your devices.
            </p>

            <div className="mt-6 border-t border-slate-100 pt-6 space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>Unlimited Documents:</strong> Create as many quotes and invoices as you need</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>Client Directory:</strong> Save profiles with custom quote/invoice prefixes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>Client Portal:</strong> Shareable web links for digital quote acceptance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>WhatsApp Reminders:</strong> Direct pre-formatted payment reminder messages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>PDF & Print:</strong> Built-in clean document print layouts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>Cloud Synchronization:</strong> Secure cloud storage via Supabase</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/register"
                className="block text-center text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 py-3.5 rounded-lg transition-colors"
              >
                Create Your Free Account
              </Link>
            </div>
          </div>

          {/* FEATURE COMPARISON TABLE */}
          <div className="mt-16">
            <h3 className="text-lg font-bold text-slate-900 text-center mb-6">What&apos;s Included</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Feature</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-normal text-slate-800">
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">Quoting & Invoicing</td>
                    <td className="p-4 text-emerald-600 font-bold">Included</td>
                    <td className="p-4 text-slate-600">Full itemization, custom notes, payment terms, and status tracking.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">Client Portal Links</td>
                    <td className="p-4 text-emerald-600 font-bold">Included</td>
                    <td className="p-4 text-slate-600">Clients review and accept quotes via a clean web interface.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">WhatsApp Sharing</td>
                    <td className="p-4 text-emerald-600 font-bold">Included</td>
                    <td className="p-4 text-slate-600">Send formatted links and payment reminder prompts with 1-click.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">Multi-Device Sync</td>
                    <td className="p-4 text-emerald-600 font-bold">Included</td>
                    <td className="p-4 text-slate-600">Access your business database safely across your computer and mobile browser.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white tracking-tight uppercase">VYLEX OPS</span>
              <span className="text-[10px] text-slate-500 font-mono">by</span>
              <a
                href="https://vylex.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-sky-400 hover:underline"
              >
                vylex.co.za
              </a>
            </div>
            <p className="mt-1 text-slate-500">Free business billing and operations management system.</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
