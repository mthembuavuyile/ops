import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Vylex Ops",
  description: "Terms of Service and usage conditions for the Vylex Ops platform.",
  alternates: {
    canonical: "https://ops.vylex.co.za/terms",
  },
  openGraph: {
    title: "Terms of Service — Vylex Ops",
    description: "Terms of Service and usage conditions for the Vylex Ops platform.",
    url: "https://ops.vylex.co.za/terms",
    siteName: "Vylex Ops",
  },
};

export default function TermsPage() {
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
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-3">Legal Agreement</h2>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
            <p className="mt-2 text-xs text-slate-500 font-mono">Last updated: July 2026</p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-12 max-w-3xl mx-auto px-6 space-y-8 text-xs md:text-sm text-slate-700 leading-relaxed">
          <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
            
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Vylex Ops (&quot;the Service&quot;), operated by Vylex, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Service.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Description of Service</h2>
              <p>
                Vylex Ops provides business operations software for creating quotes, issuing invoices, managing client records, and sharing billing documents. The Service includes cloud database storage for user account data.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Account Responsibility</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities performed under your account. You agree to provide accurate information when registering for the Service.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. User Content & Documents</h2>
              <p>
                You retain full ownership of all client records, quotations, invoices, and business data that you store in Vylex Ops. Vylex Ops does not claim ownership over any user-created documents. You are solely responsible for ensuring the accuracy of your financial and billing information.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">5. Acceptable Use</h2>
              <p>
                You agree not to use Vylex Ops for any illegal, fraudulent, or unauthorized purpose, including sending spam or generating fraudulent invoices.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">6. Limitation of Liability</h2>
              <p>
                Vylex Ops is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. In no event shall Vylex or its operators be liable for any indirect, incidental, or consequential damages resulting from the use of the Service.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Continued use of the platform following any changes constitutes your acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">8. Contact Information</h2>
              <p>
                If you have any questions regarding these terms, please visit{" "}
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
