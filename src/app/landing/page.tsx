import React from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Business Billing & Invoicing Software",
  description:
    "Free operations tool for quotes, invoices, PDF generation, client portal links, WhatsApp sharing, and AI-assisted billing for freelancers and small businesses.",
  alternates: {
    canonical: "https://ops.vylex.co.za/landing",
  },
  openGraph: {
    title: "Free Business Billing & Invoicing Software | Vylex Ops",
    description:
      "Free operations tool for quotes, invoices, PDF generation, client portal links, WhatsApp sharing, and AI-assisted billing for freelancers and small businesses.",
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
          <Logo href="/" mode="light" size="sm" />

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#ai" className="hover:text-slate-900 transition-colors">AI Tools</a>
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
            Quoting, invoicing, and payment collection for small businesses.
          </h1>
          <p className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            A practical billing tool for freelancers and small businesses in South Africa. Create quotes with line items, generate PDF invoices, share client portal links, and send WhatsApp payment reminders. Optional AI assists help you draft documents faster.
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
              See What It Does
            </a>
          </div>
        </div>
      </section>

      {/* SYSTEM SUMMARY BAR */}
      <section className="border-b border-slate-200 bg-slate-100 py-6">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Client Directory</div>
            <div className="text-xs text-slate-500 mt-1">Profiles & Custom Prefixes</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quote Builder</div>
            <div className="text-xs text-slate-500 mt-1">Line Items & Portal Links</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Invoice Generator</div>
            <div className="text-xs text-slate-500 mt-1">PDF Download & Status</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">WhatsApp Sharing</div>
            <div className="text-xs text-slate-500 mt-1">Links & Payment Reminders</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Assist</div>
            <div className="text-xs text-slate-500 mt-1">Text Parsing & Drafting</div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">Core Features</h2>
          <p className="text-2xl font-bold text-slate-900 mt-2">What the app actually does.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">01 / Quoting</div>
            <h3 className="text-base font-bold text-slate-900">Quote Builder & Client Portal</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Create quotes with itemized line items (description, quantity, unit rate), custom notes, and configurable validity periods (7, 14, or 30 days). Each quote gets a unique shareable portal link where your client can review the full document and click &quot;Accept&quot; — which automatically generates a matching invoice.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">02 / Invoicing</div>
            <h3 className="text-base font-bold text-slate-900">Invoice Generator & PDF Download</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Generate standalone invoices with a live preview, custom accent color, your business address, client details, and banking information. Download invoices as PDF files directly. Invoices can also be auto-created when a client accepts a quote (14-day payment term). Track status as Unpaid or Paid.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">03 / Communication</div>
            <h3 className="text-base font-bold text-slate-900">WhatsApp Sharing & Payment Reminders</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Share quote and invoice portal links directly via WhatsApp with pre-formatted messages that include the document number, total, and a clickable link. Send payment reminders with three tone presets: friendly, due today, or overdue. Messages include your banking details and invoice reference number.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">04 / Clients</div>
            <h3 className="text-base font-bold text-slate-900">Client Directory & Auto-Numbering</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Save client profiles with name, contact person, email, phone, address, and a custom prefix (e.g. &quot;VYL&quot;). The prefix is used for automatic document numbering. Clients can be quickly selected when creating new quotes or invoices.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">05 / Settings</div>
            <h3 className="text-base font-bold text-slate-900">Business Profile & Banking</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Configure your company name, multiple business addresses, contact details, and multiple bank accounts (with bank name, account number, branch code, and PayShap ID). Set your accent color and default currency. Includes data backup export and import as JSON files.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">06 / History</div>
            <h3 className="text-base font-bold text-slate-900">Records & CSV Export</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              View saved billing records with document number, client, date, and total. Toggle payment status between Paid and Credit. Send a WhatsApp reminder directly from any history record. Export your full history as a CSV file for spreadsheet use.
            </p>
          </div>

        </div>
      </section>

      {/* AI TOOLS SECTION */}
      <section id="ai" className="border-t border-b border-slate-200 bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">AI Assist</h2>
            <p className="text-2xl font-bold text-slate-900 mt-2">Optional shortcuts — not required to use the app.</p>
            <p className="text-xs text-slate-500 mt-2 max-w-2xl">
              These features use a free AI model via OpenRouter to help you work faster. They are completely optional. Every AI output is shown for your review before anything is saved or sent. If the AI service is unavailable, all manual workflows continue to work normally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-paste text-purple-600 text-sm" />
                <h3 className="text-sm font-bold text-slate-900">Import from Notes</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste a WhatsApp message, email, or rough notes into a text box. The AI extracts line items with descriptions, quantities, and rates, then fills in the quote builder form. You review and edit every field before saving.
              </p>
              <p className="text-[10px] text-slate-400 mt-3">Available in: Quote Builder</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-wand-magic-sparkles text-purple-600 text-sm" />
                <h3 className="text-sm font-bold text-slate-900">Refine Descriptions</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click a button next to any line item description to expand vague text (e.g. &quot;plumbing work&quot;) into specific scope bullet points (e.g. &quot;Pressure test &amp; leak diagnostic, replacement of mixer cartridge&quot;). Helps reduce client disputes over scope.
              </p>
              <p className="text-[10px] text-slate-400 mt-3">Available in: Quote Builder, Invoice Generator</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-pen-fancy text-purple-600 text-sm" />
                <h3 className="text-sm font-bold text-slate-900">Draft Payment Reminders</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate a context-aware WhatsApp payment reminder message based on the client name, amount owed, due date, and your chosen tone. You can add extra context (e.g. &quot;client paid 50% deposit&quot;). The draft appears in the preview — you edit or switch back to a template before sending.
              </p>
              <p className="text-[10px] text-slate-400 mt-3">Available in: Payment Reminders</p>
            </div>
          </div>
        </div>
      </section>

      {/* FUNCTIONAL WORKFLOW TABULAR SECTION */}
      <section id="workflow" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">Workflow</h2>
            <p className="text-2xl font-bold text-slate-900 mt-2">How a job moves through the system.</p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Stage</th>
                  <th className="p-4">What You Do</th>
                  <th className="p-4">What Happens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-normal text-slate-800">
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">1. Add Client</td>
                  <td className="p-4">Enter client name, contact, phone, email, address, and a 3-letter prefix.</td>
                  <td className="p-4 text-slate-600">Client profile saved. Prefix used for automatic document numbering (e.g. VYL-2026-001).</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">2. Create Quote</td>
                  <td className="p-4">Select client, add line items with description, quantity, and unit rate. Set validity period.</td>
                  <td className="p-4 text-slate-600">Quote generated with auto-number (e.g. Q-2026-001). Shareable portal link created.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">3. Share & Accept</td>
                  <td className="p-4">Send the portal link to your client via WhatsApp. Client reviews and clicks &quot;Accept&quot;.</td>
                  <td className="p-4 text-slate-600">Quote status changes to &quot;Accepted&quot;. A matching invoice is automatically created with a 14-day due date.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">4. Collect Payment</td>
                  <td className="p-4">Share the invoice link or send a WhatsApp payment reminder with your banking details.</td>
                  <td className="p-4 text-slate-600">Client pays via bank transfer using the reference number. You mark the invoice as &quot;Paid&quot;.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">5. Record Keeping</td>
                  <td className="p-4">View billing history. Export records as CSV. Back up all data as a JSON file.</td>
                  <td className="p-4 text-slate-600">Full audit trail. Data synced to cloud across all your devices.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ACCESS & PRICING SECTION */}
      <section id="access" className="border-t border-slate-200 bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">Free Access</h2>
            <p className="text-2xl font-bold text-slate-900 mt-2">No paid tiers. No feature gating.</p>
            <p className="text-xs text-slate-500 mt-2">Everything listed on this page is included in the free account.</p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="bg-white border-2 border-slate-900 rounded-xl p-8 flex flex-col justify-between relative shadow-lg">
              <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Free Always
              </div>
              <div>
                <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">Cloud Account</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">Free</div>
                <div className="text-xs text-slate-500 mt-1">Sync data across your devices via Supabase</div>
                <ul className="mt-6 space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                    Unlimited quotes, invoices, and client profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                    Multi-device cloud sync (auto-refreshes on focus)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                    Shareable client portal links for quote acceptance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                    PDF invoice generation and download
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                    WhatsApp document sharing and payment reminders
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                    Multiple business addresses and bank accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                    AI-assisted text parsing and message drafting
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                    Data backup export/import (JSON) and history CSV export
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="block text-center text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 py-3.5 rounded-lg transition-colors"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="border-t border-slate-200 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">Frequently Asked Questions</h2>
            <p className="text-2xl font-bold text-slate-900 mt-2">Straight answers.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">Is Vylex Ops really free?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Yes. There are no paid tiers, no trial periods, and no feature gating. You create a free account and get access to everything listed on this page.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">Where is my data stored?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Your data is stored in a Supabase-hosted PostgreSQL database, linked to your authenticated account. Each user can only access their own data (enforced via row-level security policies). You can also export a full backup as a JSON file at any time from Settings.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">How do client portal links work?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                When you create a quote, the system generates a unique URL. You send this link to your client (typically via WhatsApp). They open it in their browser, see the full quote with line items and totals, and can click &quot;Accept Quote&quot;. Accepting automatically updates the quote status and creates a matching unpaid invoice.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">Can I download documents as PDFs?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Yes. The Invoice Generator has a &quot;Download PDF&quot; button that renders the invoice preview into a downloadable PDF file. Quotes can be printed to PDF via the browser&apos;s print function using the app&apos;s built-in print styles.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">How does the AI integration work?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The app connects to OpenRouter (a free AI API) to provide three optional shortcuts: parsing rough text into structured line items, expanding vague descriptions into detailed scope bullets, and drafting context-aware payment reminder messages. All AI output is shown in the form for you to review and edit before saving or sending. The AI never sends anything to your clients automatically. If the AI service is down, all features work normally without it.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900">Does Vylex Ops handle VAT?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The quote builder currently operates with 0% VAT (suited for businesses under the South African R1M VAT registration threshold). The invoice generator also defaults to 0% VAT. There is no configurable VAT rate input at this time.
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
            <p className="mt-1 text-slate-500">Free business billing and operations tool.</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Workspace</Link>
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
