import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vylex Ops — Simple Business Billing & Invoicing",
  description: "Minimalist operations tool for quotes, invoices, and client billing management.",
  alternates: {
    canonical: "https://ops.vylex.co.za/landing",
  },
  openGraph: {
    title: "Vylex Ops — Simple Business Billing & Invoicing",
    description: "Minimalist operations tool for quotes, invoices, and client billing management.",
    url: "https://ops.vylex.co.za/landing",
    siteName: "Vylex Ops",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-base font-extrabold tracking-tight text-slate-900 uppercase">
            VYLEX<span className="text-sky-600">OPS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-slate-900 transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
            >
              Open Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="border-b border-slate-200 bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Quoting, invoicing, and client billing in one place.
          </h1>
          <p className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            A straightforward operations dashboard built for service businesses and independent professionals. Manage client directories, issue accepted quotes, track unpaid invoices, and export documents.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-6 py-3.5 rounded-lg transition-colors text-center"
            >
              Launch App Workspace
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-6 py-3.5 rounded-lg transition-colors text-center"
            >
              View System Features
            </a>
          </div>
        </div>
      </section>

      {/* SYSTEM SUMMARY BAR */}
      <section className="border-b border-slate-200 bg-slate-100 py-6">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Client Management</div>
            <div className="text-xs text-slate-500 mt-1">Directory & Custom Prefixes</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quote Builder</div>
            <div className="text-xs text-slate-500 mt-1">Itemized Scope & Pricing</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Invoice Engine</div>
            <div className="text-xs text-slate-500 mt-1">Auto-Conversion & Due Dates</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Document Export</div>
            <div className="text-xs text-slate-500 mt-1">PDF & Direct WhatsApp Links</div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">Core Capabilities</h2>
          <p className="text-2xl font-bold text-slate-900 mt-2">Built for practical day-to-day operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">01 / Quoting</div>
            <h3 className="text-base font-bold text-slate-900">Quotations & Estimates</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Create structured cost estimates with line items, tax configurations, custom notes, and expiration limits. Clients can view and accept quotes directly.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">02 / Invoicing</div>
            <h3 className="text-base font-bold text-slate-900">Invoice Management</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Convert accepted quotes into invoices with a single click. Maintain clear payment statuses (unpaid, paid, overdue) and track outstanding balances.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">03 / Communication</div>
            <h3 className="text-base font-bold text-slate-900">PDF & Reminders</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Generate clean PDF documents ready for download or client distribution. Send formatted payment reminder messages via WhatsApp or email.
            </p>
          </div>

        </div>
      </section>

      {/* FUNCTIONAL WORKFLOW TABULAR SECTION */}
      <section id="workflow" className="border-t border-b border-slate-200 bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">Workflow</h2>
            <p className="text-2xl font-bold text-slate-900 mt-2">How document state moves through the system.</p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Output / Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-normal text-slate-800">
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">1. Client Record</td>
                  <td className="p-4">Add client contact, email, and prefix identifier.</td>
                  <td className="p-4 text-slate-600">Established client profile for auto-numbering.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">2. Quote Generation</td>
                  <td className="p-4">Define line items, rates, quantities, and scope details.</td>
                  <td className="p-4 text-slate-600">Issued Quote record (e.g. Q-2026-001).</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">3. Portal Review</td>
                  <td className="p-4">Share client portal link for digital acceptance.</td>
                  <td className="p-4 text-slate-600">Quote status set to Accepted.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">4. Invoice Conversion</td>
                  <td className="p-4">System auto-generates invoice from accepted quote.</td>
                  <td className="p-4 text-slate-600">Invoice record with 14-day payment term.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">5. Payment Resolution</td>
                  <td className="p-4">Mark payment received or dispatch payment reminder.</td>
                  <td className="p-4 text-slate-600">Updated status to Paid and balance update.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 max-w-6xl mx-auto px-6">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">Pricing Structure</h2>
          <p className="text-2xl font-bold text-slate-900 mt-2">Straightforward access models.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* FREE TIER */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Local Workspace</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">R0</div>
              <div className="text-xs text-slate-500 mt-1">Free forever / Local storage mode</div>
              <ul className="mt-6 space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                  Unlimited local quotes & invoices
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                  Client directory management
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                  PDF exports & WhatsApp link sharing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                  Local browser data storage
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/"
                className="block text-center text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 py-3 rounded-lg transition-colors"
              >
                Use Local Workspace
              </Link>
            </div>
          </div>

          {/* PRO TIER */}
          <div className="bg-white border-2 border-slate-900 rounded-xl p-8 flex flex-col justify-between relative">
            <div>
              <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">Cloud Pro</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">R199 <span className="text-xs font-normal text-slate-500">/ month</span></div>
              <div className="text-xs text-slate-500 mt-1">For active service businesses</div>
              <ul className="mt-6 space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2 font-medium text-slate-900">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                  Everything in Local Workspace
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                  Multi-device cloud synchronization
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                  Custom business branding & logo upload
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                  Automated email invoice dispatching
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/register"
                className="block text-center text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 py-3 rounded-lg transition-colors"
              >
                Start Cloud Account
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="border-t border-slate-200 bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">Frequently Asked Questions</h2>
            <p className="text-2xl font-bold text-slate-900 mt-2">Technical & operational details.</p>
          </div>

          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">Where is my workspace data stored in the free tier?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                In the free local workspace, all client profiles, quotes, and invoices are saved directly in your web browser&apos;s local storage (`localStorage`). No external database is required.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">How does quote-to-invoice conversion work?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                When a client accepts a quote via the portal view, Vylex Ops generates an invoice record carrying over line items, totals, and client information, with an automatically assigned invoice number.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">Can I export my invoices to PDF?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Yes. Built-in PDF compilation allows you to download clean document layouts directly from the quote builder, invoice viewer, or client portal.
              </p>
            </div>
          </div>
        </div>
      </section>

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
            <p className="mt-1 text-slate-500">Business billing and operations management system.</p>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Workspace</Link>
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
