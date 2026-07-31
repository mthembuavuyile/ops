import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Vylex Ops",
  description: "Privacy Policy and data handling policies for Vylex Ops users.",
  alternates: {
    canonical: "https://ops.vylex.co.za/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Vylex Ops",
    description: "Privacy Policy and data handling policies for Vylex Ops users.",
    url: "https://ops.vylex.co.za/privacy",
    siteName: "Vylex Ops",
  },
};

export default function PrivacyPage() {
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
              <Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
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
        <section className="border-b border-slate-200 bg-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-3">Data & Privacy</h2>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="mt-2 text-xs text-slate-500 font-mono">Last updated: July 2026</p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-12 max-w-3xl mx-auto px-6 space-y-8 text-xs md:text-sm text-slate-700 leading-relaxed">
          <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
            
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Overview</h2>
              <p>
                At Vylex Ops, we respect your privacy and are committed to protecting the personal and business data you store within the platform. This Privacy Policy outlines what information we collect, how it is stored, and how it is protected.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Information We Collect</h2>
              <p>When you create an account and use Vylex Ops, we collect:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                <li><strong>Account Credentials:</strong> Email address and encrypted password for account authentication.</li>
                <li><strong>Business Settings:</strong> Company name, contact email, phone, business address, and bank payment details for document generation.</li>
                <li><strong>Billing Data:</strong> Client contact records, generated quotes, invoices, item lists, and payment statuses.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Data Storage & Security</h2>
              <p>
                Your account and billing data is securely stored using Supabase cloud infrastructure with Row Level Security (RLS) policies enforced. This ensures your business data is only accessible to your authenticated account session.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Third-Party Sharing</h2>
              <p>
                We do <strong>not</strong> sell, rent, or trade your personal or business data to third parties, advertisers, or data brokers under any circumstances.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">5. Client Portal Links</h2>
              <p>
                When you share a client portal quote link, the recipient can view the specific quote document. Shareable links are generated securely for document review and quote acceptance.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">6. Your Rights</h2>
              <p>
                You have the right to inspect, update, or delete your billing records and account data at any time from your Vylex Ops account dashboard or settings.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">7. Contact Us</h2>
              <p>
                For privacy inquiries or account support, please contact us via{" "}
                <a href="https://vylex.co.za" target="_blank" rel="noopener noreferrer" className="text-sky-600 font-semibold hover:underline">
                  vylex.co.za
                </a>.
              </p>
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
            <Link href="/" className="hover:text-white transition-colors">Workspace</Link>
            <Link href="/landing" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            <a
              href="https://vylex.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Vylex Home
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
