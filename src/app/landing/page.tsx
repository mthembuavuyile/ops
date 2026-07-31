import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vylex Ops — Free Business Billing & Invoicing Tool",
  description: "Free minimalist operations tool for quotes, invoices, client portal links, and billing management.",
  alternates: {
    canonical: "https://ops.vylex.co.za/landing",
  },
  openGraph: {
    title: "Vylex Ops — Free Business Billing & Invoicing Tool",
    description: "Free minimalist operations tool for quotes, invoices, client portal links, and billing management.",
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
            <a href="#access" className="hover:text-slate-900 transition-colors">Free Access</a>
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
              Open App
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="border-b border-slate-200 bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Simple quoting, invoicing, and billing for your business.
          </h1>
          <p className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            A practical, no-nonsense billing operations tool for freelancers and small businesses. Create quotes, convert them to invoices, share online portal links, and send WhatsApp payment reminders.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-6 py-3.5 rounded-lg transition-colors text-center"
            >
              Start Using Vylex Ops (Free)
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-6 py-3.5 rounded-lg transition-colors text-center"
            >
              Explore Features
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
            <div className="text-xs text-slate-500 mt-1">Line Items & Portal Accept</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Invoice Engine</div>
            <div className="text-xs text-slate-500 mt-1">Auto-Conversion & Payment Terms</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Direct Sharing</div>
            <div className="text-xs text-slate-500 mt-1">WhatsApp & PDF Exports</div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">Core Capabilities</h2>
          <p className="text-2xl font-bold text-slate-900 mt-2">Built for practical day-to-day business operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">01 / Quoting</div>
            <h3 className="text-base font-bold text-slate-900">Quotations & Client Portal</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Create detailed quotes with itemized pricing, custom notes, and validity dates. Share an online client portal link where clients can review and accept quotes digitally.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">02 / Invoicing</div>
            <h3 className="text-base font-bold text-slate-900">Invoices & Auto Conversion</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Instantly turn accepted quotes into professional invoices or generate standalone invoices. Track status (Unpaid, Paid, Settled) and manage payment due dates.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">03 / Communication & Banking</div>
            <h3 className="text-base font-bold text-slate-900">WhatsApp & Banking Details</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Share document links directly via WhatsApp with pre-filled messages. Include custom bank account details, branch codes, and PayShap IDs on all documents.
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
                  <td className="p-4">Add client contact details, email, and custom prefix.</td>
                  <td className="p-4 text-slate-600">Client profile ready for automatic document numbering.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">2. Quote Generation</td>
                  <td className="p-4">Add line items, quantities, pricing, tax rates, and notes.</td>
                  <td className="p-4 text-slate-600">Issued Quote record (e.g. Q-2026-001).</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">3. Portal Acceptance</td>
                  <td className="p-4">Share unguessable link for digital client review.</td>
                  <td className="p-4 text-slate-600">Client accepts quote directly online.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">4. Invoice Conversion</td>
                  <td className="p-4">System auto-generates invoice from accepted quote.</td>
                  <td className="p-4 text-slate-600">Invoice created with 14-day payment due term.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">5. Settlement & Reminders</td>
                  <td className="p-4">Mark invoice as paid or send WhatsApp payment reminder.</td>
                  <td className="p-4 text-slate-600">Status set to Settled/Paid and balance updated.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ACCESS & PRICING SECTION */}
      <section id="access" className="py-20 max-w-6xl mx-auto px-6">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">Free Access</h2>
          <p className="text-2xl font-bold text-slate-900 mt-2">Choose how you want to use Vylex Ops.</p>
          <p className="text-xs text-slate-500 mt-2">Both options are completely free to use with zero hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* LOCAL MODE */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instant Local Mode</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">Free</div>
              <div className="text-xs text-slate-500 mt-1">No sign-up required / Saved in your browser</div>
              <ul className="mt-6 space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                  Unlimited quotes, invoices & client profiles
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                  Save & print PDF documents directly
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                  WhatsApp reminder message generator
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                  Manual JSON data backup export & import
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/"
                className="block text-center text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 py-3 rounded-lg transition-colors"
              >
                Launch Local App
              </Link>
            </div>
          </div>

          {/* CLOUD SYNC MODE */}
          <div className="bg-white border-2 border-slate-900 rounded-xl p-8 flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Recommended
            </div>
            <div>
              <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">Cloud Sync Account</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">Free</div>
              <div className="text-xs text-slate-500 mt-1">Sync your data across all your devices</div>
              <ul className="mt-6 space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2 font-medium text-slate-900">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                  Everything included in Local Mode
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                  Multi-device real-time cloud synchronization
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                  Secure account login (Supabase authentication)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                  Shareable client portal links for quote acceptance
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/register"
                className="block text-center text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 py-3 rounded-lg transition-colors"
              >
                Create Free Account
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
            <p className="text-2xl font-bold text-slate-900 mt-2">Clear answers about how Vylex Ops works.</p>
          </div>

          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">Is Vylex Ops really free to use?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Yes. Vylex Ops is completely free. You can use it immediately without registering in Local Mode, or create a free account to sync your billing data securely across multiple devices.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">Where is my data stored?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                In Local Mode, data is stored exclusively in your browser&apos;s local storage (`localStorage`). When logged into a free account, your data syncs securely to your personal database profile on Supabase.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">How do client portal links and quote acceptance work?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                When you generate a quote, Vylex Ops creates a shareable link. Clients can open this link in their browser to review the document and click &quot;Accept Quote&quot;, which automatically updates the quote status and creates a matching invoice.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">Can I save or print documents as PDFs?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Yes. Built-in browser print styles allow you to print clean quotes and invoices directly or save them as PDF files to send to your clients.
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
            <p className="mt-1 text-slate-500">Free business billing and operations management system.</p>
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
